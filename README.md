# Akıllı Görev & Proje Yönetim Sistemi (Trello Clone)

Ekiplerin görev oluşturduğu, takip ettiği, sürükle-bırak mantığıyla çalışan, 
web ve mobil üzerinden erişilebilen bir görev/proje yönetim sistemi.

## Kullanılan Teknolojiler
- Backend: Node.js, Express, Prisma, PostgreSQL (Supabase)
- Web: React
- Mobil: React Native (Expo)
- Kimlik Doğrulama: JWT



## Hafta 1 — Analiz & Tasarım

### Trello İncelemesi
Trello incelendi. Sistemin temel mantığı: bir "board" (pano) içinde birden fazla 
liste (To Do, Doing, Done) bulunuyor, her listede kartlar (görevler) var ve bu 
kartlar sürükle-bırak ile listeler arasında taşınabiliyor. Bu proje de aynı 
mantıkla çalışacak: Proje > Görev > Durum yapısı kurulacak.

### Kullanıcı Hikayeleri (User Stories)

1. Bir kullanıcı olarak, sisteme kayıt olmak istiyorum ki hesabım oluşsun.
2. Bir kullanıcı olarak, email ve şifremle giriş yapmak istiyorum ki projelerime erişebileyim.
3. Bir kullanıcı olarak, yeni bir proje oluşturmak istiyorum ki görevlerimi organize edebileyim.
4. Bir kullanıcı olarak, projelerimin listesini görmek istiyorum.
5. Bir kullanıcı olarak, bir projeye yeni görev eklemek istiyorum.
6. Bir kullanıcı olarak, bir görevin durumunu değiştirmek istiyorum (todo → doing → done) 
   ki ilerlemeyi takip edebileyim.
7. Bir kullanıcı olarak, artık gerekmeyen bir görevi silmek istiyorum.
8. Bir kullanıcı olarak, artık gerekmeyen bir projeyi silmek istiyorum.
9. Bir admin olarak, sistemdeki tüm kullanıcıları görüntülemek istiyorum.
10. Bir kullanıcı olarak, oturumumun güvenli (şifreli) şekilde saklanmasını istiyorum.

### Veritabanı Tasarımı (ER Diagram)

**User (Kullanıcı)**
| Alan | Tip | Açıklama |
|---|---|---|
| id | Int | Birincil anahtar |
| name | String | Kullanıcı adı |
| email | String | Benzersiz, giriş için kullanılır |
| password | String | Hashlenmiş şifre |
| role | String | "user" veya "admin" |
| createdAt | DateTime | Kayıt tarihi |

**Project (Proje)**
| Alan | Tip | Açıklama |
|---|---|---|
| id | Int | Birincil anahtar |
| title | String | Proje adı |
| ownerId | Int | User.id'ye bağlı (yabancı anahtar) |
| createdAt | DateTime | Oluşturulma tarihi |

**Task (Görev)**
| Alan | Tip | Açıklama |
|---|---|---|
| id | Int | Birincil anahtar |
| title | String | Görev başlığı |
| status | String | "todo" / "doing" / "done" |
| projectId | Int | Project.id'ye bağlı (yabancı anahtar) |
| createdAt | DateTime | Oluşturulma tarihi |

**İlişkiler:**
- Bir Kullanıcı (User) → Birden fazla Proje (Project) oluşturabilir (1—N)
- Bir Proje (Project) → Birden fazla Görev (Task) içerebilir (1—N)



### API Endpoint Planı

| Metod | Endpoint | Açıklama | Giriş Gerekli mi? |
|---|---|---|---|
| POST | /api/auth/register | Yeni kullanıcı kaydı | Hayır |
| POST | /api/auth/login | Giriş yap, token al | Hayır |
| GET | /api/projects | Kullanıcının tüm projelerini listele | Evet |
| POST | /api/projects | Yeni proje oluştur | Evet |
| GET | /api/projects/:id | Tek bir projeyi getir | Evet |
| DELETE | /api/projects/:id | Projeyi sil | Evet |
| GET | /api/tasks?projectId=1 | Bir projenin görevlerini listele | Evet |
| POST | /api/tasks | Yeni görev oluştur | Evet |
| PATCH | /api/tasks/:id/status | Görevin durumunu değiştir | Evet |
| DELETE | /api/tasks/:id | Görevi sil | Evet |

### Fake API Planı
Backend hazır olmadan önce frontend geliştirmeye başlanabilmesi için `json-server` 
ile örnek/sahte veri planı hazırlandı. Gerçek backend Hafta 2'de bu endpoint 
yapısına birebir uygun şekilde geliştirilecek.
