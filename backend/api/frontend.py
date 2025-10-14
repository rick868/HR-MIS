from django.http import HttpResponse, Http404
from django.conf import settings
from pathlib import Path


def serve_frontend(request):
    """Serve the built frontend index.html if it exists.

    Use this for production where the frontend is built into frontend/dist.
    """
    dist_dir = Path(settings.BASE_DIR).parent / 'frontend' / 'dist'
    index_file = dist_dir / 'index.html'
    if not index_file.exists():
        raise Http404('Frontend build not found')

    return HttpResponse(index_file.read_text(), content_type='text/html')
