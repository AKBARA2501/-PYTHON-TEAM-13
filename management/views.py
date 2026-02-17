from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CampusUser, Resource, Booking
from .serializers import CampusUserSerializer, ResourceSerializer, BookingSerializer

class CampusUserViewSet(viewsets.ModelViewSet):
    queryset = CampusUser.objects.all()
    serializer_class = CampusUserSerializer

    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        identifier = request.data.get('identifier')
        password = request.data.get('password')
        role = request.data.get('role')

        # Admin Bypass (Keep your hardcoded admin as requested)
        if role == 'ADMIN' and identifier == 'akbar' and password == 'akbar27022004':
            return Response({
                "success": True,
                "user": {"id": 0, "name": "System Admin", "role": "ADMIN", "campus_id": "ADMIN"}
            })

        try:
            # Check database for Student/Staff
            from django.db.models import Q
            user = CampusUser.objects.get(
                Q(email=identifier) | Q(campus_id=identifier),
                role=role,
                status='ACTIVE'
            )
            
            # Simple check for the password
            if user.password == password:
                serializer = self.get_serializer(user)
                return Response({
                    "success": True,
                    "user": serializer.data
                })
            else:
                return Response({"success": False, "message": "Incorrect password."}, status=status.HTTP_401_UNAUTHORIZED)
        except CampusUser.DoesNotExist:
            return Response({"success": False, "message": "User not found or inactive."}, status=status.HTTP_404_NOT_FOUND)

class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
