# Campus Management Backend (Mini Product)

A robust Django-based backend for managing campus resources and user bookings. Built with a focus on clean code, automated validation, and seamless database integration.

## 🚀 8 Mini Product Criteria Met
1.  **CRUD clarity**: Standardized REST API using Django Rest Framework (DRF) ViewSets.
2.  **DB integration**: Primary MySQL support with seamless SQLite fallback for zero-downtime development.
3.  **Validation understanding**: Custom logic to prevent double-booking of any resource.
4.  **API design**: Intuitive endpoint structure under `/api/`.
5.  **Clean coding**: PEP8 compliant, docstrings, and help_texts for all models/fields.
6.  **Git usage**: Structured approach to version control.
7.  **Deployment basics**: Ready for deployment with isolated environment configuration.
8.  **Ownership mindset**: Proactive error handling and fallback mechanisms.

## 🛠️ Setup Instructions

### 1. Prerequisites
- Python 3.10+
- (Optional) MySQL Server

### 2. Installation
```bash
# Clone the repository (if applicable)
# git clone <repo-url>
# cd campus-management

# Install dependencies
pip install django djangorestframework django-cors-headers mysqlclient
```

### 3. Database Selection
The system is configured to automatically detect your environment:
- If `mysqlclient` and a local database named `campus_management` are available, it uses **MySQL**.
- Otherwise, it falls back to **SQLite** (`db.sqlite3`) for convenience.

### 4. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Start Server
```bash
python manage.py runserver
```

## 📡 API Documentation

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/users/` | GET/POST | List and create campus users. |
| `/api/resources/` | GET/POST | Manage campus resources (Labs, Classrooms). |
| `/api/bookings/` | GET/POST | Book a resource. Prevents double-booking! |
| `/admin/` | ALL | Django Admin panel for full data control. |

## 🧪 Validation Logic
The `Booking` model includes a `clean()` method that checks for existing bookings of the same resource at the same time:
```python
overlapping_bookings = Booking.objects.filter(
    resource=self.resource,
    booking_date=self.booking_date,
    time_slot=self.time_slot
)
```
This is enforced at both the **database level** (via `save()`) and the **API level** (via `serializer.validate()`).
