from django.urls import path
from tour.views import IndexView, RouteView

urlpatterns = [
    path('', IndexView.as_view()),
    path('route/', RouteView.as_view())
]
