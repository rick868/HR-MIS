from django.urls import path
from .views import summary, review

urlpatterns = [
    path('summary/', summary, name='performance-summary'),
    path('review/', review, name='performance-review'),
]
