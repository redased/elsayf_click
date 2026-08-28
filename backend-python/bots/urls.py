from django.urls import path
from .views import ScrapeView, StatusView, ExecuteView

urlpatterns = [
    path('scrape/', ScrapeView.as_view(), name='scrape'),
    path('status/', StatusView.as_view(), name='status'),
    path('execute/', ExecuteView.as_view(), name='execute'),
]
