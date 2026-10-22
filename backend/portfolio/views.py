from rest_framework.viewsets import ModelViewSet

from .models import ContactMessage, Project
from .serializers import ContactMessageSerializer, ProjectSerializer


class ProjectViewSet(ModelViewSet):
    queryset = Project.objects.all().order_by('id')
    serializer_class = ProjectSerializer


class ContactMessageViewSet(ModelViewSet):
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer