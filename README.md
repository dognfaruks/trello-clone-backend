# Akıllı Görev & Proje Yönetim Sistemi (Trello Clone)

Ekiplerin görev oluşturduğu, takip ettiği, sürükle-bırak mantığıyla çalışan, web, mobil ve masaüstü üzerinden erişilebilen çok platformlu bir görev ve proje yönetim sistemi.

---

## Hafta 1 — Analiz & Tasarım

### 1. Trello İncelemesi & Çalışma Mantığı
Trello ve Jira gibi proje yönetim araçları incelendiğinde; temel çalışma prensibinin projeleri panolara (Board/Project), iş süreçlerini aşamalara (To Do, Doing, Done listeleri) ve iş parçacıklarını kartlara (Task) bölmek olduğu görülmüştür. Kartlar sürükle-bırak mantığıyla aşamalar arasında ilerletilir. Bu projede de **Kullanıcı > Proje > Görev > Durum** hiyerarşisi üzerine kurulu esnek ve ölçeklenebilir bir mimari oluşturulacaktır.

---

### 2. Kullanıcı Hikayeleri (User Stories)

1.   Bir kullanıcı olarak, sisteme kayıt olabilmek ve hesap oluşturabilmek istiyorum.
2.   Bir kullanıcı olarak, e-posta ve şifremle giriş yapmak istiyorum.
3.   Bir kullanıcı olarak, yeni projeler oluşturabilmek istiyorum.
4.   Bir kullanıcı olarak, dahil olduğum veya oluşturduğum tüm projeleri listeleyebilmek istiyorum.
5.   Bir kullanıcı olarak, bir projenin adını ve açıklamasını güncelleyebilmek istiyorum.
6.   Bir kullanıcı olarak, artık gerekmeyen bir projeyi tüm alt görevleriyle birlikte silebilmek istiyorum.
7.   Bir kullanıcı olarak, bir projeye başlık, açıklama ve sorumlu belirterek yeni görev kartı eklemek istiyorum.
8.   Bir kullanıcı olarak, bir görevin durumunu sürükle-bırak veya durum seçimiyle değiştirebilmek istiyorum (`todo` → `doing` → `done`).
9.   Bir kullanıcı olarak, bir görevin detaylarını düzenleyebilmek ve başkasına atayabilmek istiyorum..
10.  Bir admin olarak, sistemdeki kayıtlı tüm kullanıcıları listeleyebilmek ve rollerini görebilmek istiyorum.
11.  Bir kullanıcı olarak, oturum bilgilerimin ve şifremin güvenli saklanmasını istiyorum.

---

### 3. Veritabanı Tasarımı (ER Diagram)

#### **Tablolar ve Alanlar**

**User (Kullanıcı)**
| Alan | Tip | Kısıtlamalar / Açıklama |
| :--- | :--- | :--- |
| `id` | Int | Primary Key, Auto Increment |
| `name` | String | Kullanıcı Adı & Soyadı |
| `email` | String | Unique, Giriş e-postası |
| `password` | String | Hashlenmiş şifre (bcrypt) |
| `role` | String | Default: `"user"`, Enum: `"user"` / `"admin"` |
| `createdAt` | DateTime | Varsayılan oluşturulma zamanı |

**Project (Proje / Pano)**
| Alan | Tip | Kısıtlamalar / Açıklama |
| :--- | :--- | :--- |
| `id` | Int | Primary Key, Auto Increment |
| `title` | String | Proje başlığı |
| `description` | String (Opsiyonel) | Proje detay açıklaması |
| `ownerId` | Int | Foreign Key -> `User.id` |
| `createdAt` | DateTime | Varsayılan oluşturulma zamanı |

**Task (Görev Kartı)**
| Alan | Tip | Kısıtlamalar / Açıklama |
| :--- | :--- | :--- |
| `id` | Int | Primary Key, Auto Increment |
| `title` | String | Görev başlığı |
| `description` | String (Opsiyonel) | Görev detayları / kabul kriterleri |
| `status` | String | Enum: `"todo"`, `"doing"`, `"done"` (Default: `"todo"`) |
| `projectId` | Int | Foreign Key -> `Project.id` (Cascade Delete) |
| `assignedToId`| Int (Opsiyonel) | Foreign Key -> `User.id` (Görevi üstlenen kişi) |
| `createdAt` | DateTime | Varsayılan oluşturulma zamanı |

#### **İlişkiler (Relationships)**
- **User — Project:**  (Bir kullanıcı birden fazla proje oluşturabilir, bir proje tek bir kullanıcıya aittir).
- **Project — Task:**  (Bir proje birden fazla görev barındırır, bir görev tek bir projeye aittir).
- **User — Task:**  (Bir kullanıcıya birden fazla görev atanabilir).

---

### 4. REST API Endpoint Planı

| Metot | Endpoint | Açıklama | Auth / Rol |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Yeni kullanıcı kaydı | Herkese Açık |
| `POST` | `/api/auth/login` | Kullanıcı girişi ve JWT üretimi | Herkese Açık |
| `GET` | `/api/projects` | Oturum açan kullanıcının projelerini listele | Giriş Gerekli (User/Admin) |
| `POST` | `/api/projects` | Yeni proje oluştur | Giriş Gerekli (User/Admin) |
| `GET` | `/api/projects/:id` | Proje detayını ve alt görevlerini getir | Giriş Gerekli (User/Admin) |
| `PUT` | `/api/projects/:id` | Proje bilgilerini (başlık, açıklama) güncelle | Proje Sahibi / Admin |
| `DELETE` | `/api/projects/:id` | Projeyi ve alt görevlerini sil | Proje Sahibi / Admin |
| `GET` | `/api/tasks?projectId=:id` | Belirli bir projenin tüm görevlerini listele | Giriş Gerekli (User/Admin) |
| `POST` | `/api/tasks` | Projeye yeni görev kartı ekle | Giriş Gerekli (User/Admin) |
| `PUT` | `/api/tasks/:id` | Görevin içeriğini, başlığını veya atanan kişisini güncelle | Giriş Gerekli (User/Admin) |
| `PATCH` | `/api/tasks/:id/status` | Görevin durumunu güncelle (`todo`/`doing`/`done`) | Giriş Gerekli (User/Admin) |
| `DELETE` | `/api/tasks/:id` | Görev kartını sil | Giriş Gerekli (User/Admin) |
| `GET` | `/api/admin/users` | Sistemdeki tüm kullanıcıları listele | Sadece Admin |

---

### 5. Fake API Planı & Mock Veri Yapısı (`db.json`)

```json
{
  "users": [
    {
      "id": 1,
      "name": "Hidayet Toprak",
      "email": "hidayet@example.com",
      "role": "admin"
    },
    {
      "id": 2,
      "name": "Ahmet Yılmaz",
      "email": "ahmet@example.com",
      "role": "user"
    }
  ],
  "projects": [
    {
      "id": 1,
      "title": "Trello Clone Geliştirme",
      "description": "4 haftalık full-stack çok platformlu görev yönetim uygulaması",
      "ownerId": 1,
      "createdAt": "2026-08-17T10:00:00.000Z"
    }
  ],
  "tasks": [
    {
      "id": 101,
      "title": "ER Diyagramı ve API Dokümantasyonu",
      "description": "Veritabanı tablolarının ve REST endpoint listesinin hazırlanması",
      "status": "done",
      "projectId": 1,
      "assignedToId": 1,
      "createdAt": "2026-08-17T10:30:00.000Z"
    },
    {
      "id": 102,
      "title": "Express & Prisma Backend Mimarisi",
      "description": "Node.js sunucusunun ayağa kaldırılması ve PostgreSQL bağlantısı",
      "status": "doing",
      "projectId": 1,
      "assignedToId": 1,
      "createdAt": "2026-08-17T11:00:00.000Z"
    },
    {
      "id": 103,
      "title": "React Kanban UI Tasarımı",
      "description": "Sürükle-bırak destekli kart ve sütun bileşenlerinin kodlanması",
      "status": "todo",
      "projectId": 1,
      "assignedToId": 2,
      "createdAt": "2026-08-17T11:15:00.000Z"
    }
  ]
}
