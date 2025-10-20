from django.http import HttpResponse, Http404, FileResponse
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

    # If requesting an asset like /assets/*, serve the file directly to avoid HTML mime-type issues
    if request.path.startswith('/assets/'):
        asset_path = dist_dir / request.path.lstrip('/')
        if asset_path.exists() and asset_path.is_file():
            return FileResponse(open(asset_path, 'rb'))
        raise Http404('Asset not found')

    return HttpResponse(index_file.read_text(), content_type='text/html')
