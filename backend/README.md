# MoroccanStay Backend

## XAMPP / phpMyAdmin setup

1. Start `Apache` and `MySQL` from XAMPP.
2. Open `http://localhost/phpmyadmin`.
3. Create a database named `db_marrocanstay`.
4. Keep the default XAMPP user:
   - Username: `root`
   - Password: empty

The backend `.env` is already configured for:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db_marrocanstay
DB_USERNAME=root
DB_PASSWORD=
```

## Run migrations and fill demo data

From the backend folder:

```powershell
cd backend
php artisan migrate:fresh --seed
php artisan serve
```

`migrate:fresh --seed` recreates the database tables and fills demo accounts, hotels, rooms, guides, and related data.

## Demo accounts

- Admin: `admin@moroccanstay.com` / `admin123`
- Mini-admin: `manager@moroccanstay.com` / `manager123`
- Client: `client@moroccanstay.com` / `client123`
- Guides: guide emails from the seed data / `guide123`

## Frontend API URL

The frontend calls Laravel at:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

If Laravel runs on another port, update the frontend environment value.
