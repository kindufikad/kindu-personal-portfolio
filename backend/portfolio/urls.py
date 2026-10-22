from rest_framework.routers import DefaultRouter

from .views import ContactMessageViewSet, ProjectViewSet

router = DefaultRouter()
router.register('projects', ProjectViewSet)
router.register('contact-messages', ContactMessageViewSet)

urlpatterns = router.urls