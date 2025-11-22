from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from patients.views import PatientViewSet
from users.views import UserViewSet, LoginView, LogoutView, CurrentUserView
from logs.views import AccessLogViewSet

router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'users', UserViewSet, basename='user')
router.register(r'logs', AccessLogViewSet, basename='log')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/auth/me/', CurrentUserView.as_view(), name='me'),
]
