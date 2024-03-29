from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from notebooks import views

router = DefaultRouter()
router.register(r'notebooks', views.NotebookViewSet, basename='notebooks')
router.register(r'notes', views.NoteViewSet, basename='notes')

urlpatterns = [
    # auth
    path('auth/', include('authentication.urls')),
    # notebook
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    # frontend
    path('', include('frontend.urls')),
    path('notebooks/', include('frontend.urls')),
    path('signup/', include('frontend.urls')),
    path('login/', include('frontend.urls')),
    path('notebooks/<slug:notebook_pk>/', include('frontend.urls')),
    path('notebooks/<slug:notebook_pk>/notes/<slug:note_pk>/', include('frontend.urls')),
    path('new-note/', include('frontend.urls')),
    path('all-notes/', include('frontend.urls')),
    path('all-notes/<slug:note_pk>/', include('frontend.urls')),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)