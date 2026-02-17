from django.contrib import admin
from .models import CampusUser, Resource, Booking

@admin.register(CampusUser)
class CampusUserAdmin(admin.ModelAdmin):
    list_display = ('campus_id', 'name', 'email', 'role', 'status')
    list_filter = ('role', 'status')
    search_fields = ('name', 'email', 'campus_id')

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'capacity', 'status')
    list_filter = ('type', 'status')
    search_fields = ('name',)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'resource', 'booking_date', 'start_time', 'end_time', 'status')
    list_filter = ('status', 'booking_date')
    search_fields = ('user__name', 'resource__name')
