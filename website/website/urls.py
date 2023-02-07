from django.urls import path
from tour.views import TourListView

urlpatterns = [
    path('', TourListView.as_view()),
]
