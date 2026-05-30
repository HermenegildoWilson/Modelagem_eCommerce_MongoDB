"""Rotas REST para as queries avançadas do catálogo."""

from django.urls import path

from eCommerce.backend.apps.catalog import views

urlpatterns = [
    path("", views.api_root, name="api-root"),
    path("health/", views.health_check, name="health-check"),
    path("products/faceted/", views.faceted_search, name="faceted-search"),
    path("products/dynamic-attributes/", views.dynamic_attributes_search, name="dynamic-attributes"),
    path("products/<str:identifier>/", views.product_detail, name="product-detail"),
    path("products/<str:identifier>/similar/", views.similar_products, name="similar-products"),
    path("search/", views.full_text_search, name="full-text-search"),
    path("analytics/category-sales/", views.category_sales, name="category-sales"),
    path("analytics/profitability/", views.profitability, name="profitability"),
]
