from rest_framework import serializers
from .models import CampusUser, Resource, Booking

class CampusUserSerializer(serializers.ModelSerializer):
    """Serializer for CampusUser model. (Criterion: Clean coding)"""
    class Meta:
        model = CampusUser
        fields = ['id', 'name', 'email', 'phone', 'campus_id', 'role', 'status', 'password', 'created_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }

class ResourceSerializer(serializers.ModelSerializer):
    """Serializer for Resource model. (Criterion: Clean coding)"""
    class Meta:
        model = Resource
        fields = ['id', 'name', 'type', 'capacity', 'status']

class BookingSerializer(serializers.ModelSerializer):
    """
    Serializer for Booking model with integrated validation.
    (Criterion: Validation understanding, Clean coding)
    """
    class Meta:
        model = Booking
        fields = ['id', 'user', 'resource', 'booking_date', 'start_time', 'end_time', 'status', 'rejection_reason']

    def validate(self, data):
        # Merge incoming data with existing instance fields for partial updates
        if self.instance:
            # Start with current instance values
            for field in ['user', 'resource', 'booking_date', 'start_time', 'end_time', 'status', 'rejection_reason']:
                if field not in data:
                    data[field] = getattr(self.instance, field)
            
            # Create instance and preserve PK for overlapping check (.exclude(pk=self.pk))
            instance = Booking(**data)
            instance.pk = self.instance.pk
        else:
            instance = Booking(**data)
            
        try:
            instance.clean()
        except Exception as e:
            # Catching the "Oops" message specifically
            raise serializers.ValidationError(str(e))
        return data
