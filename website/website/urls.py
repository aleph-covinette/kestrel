from django.urls import path
from tour.views import IndexView

urlpatterns = [
    path('', IndexView.as_view()),
]
