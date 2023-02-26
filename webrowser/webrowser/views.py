from django.http import HttpResponse
from tokenapi.http import JsonResponse, JsonError
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.conf import settings
import os

def home(request):
    return render(request, template_name="index.html")



@csrf_exempt
def get_list(request):
    base_dir = request.POST["path"] if "path" in request.POST else settings.DIR_INIT
    if settings.DIR_INIT not in base_dir:
        base_dir = settings.DIR_INIT
    os.chdir(base_dir  )
    contenido  = os.listdir(base_dir)
    res = {"path":base_dir, 'items':[]}
    for s in contenido:
        if os.path.isfile(s):
            res["items"].append({'nombre':s, "tipo": "file", "selected": False})
        else:
            res["items"].append({'nombre':s, "tipo": "dir", "selected": False})
            

    return JsonResponse(res)

@csrf_exempt
def new_folder(request):
    try:
        base_dir = request.POST["path"] if "path" in request.POST else settings.DIR_INIT
        name_folder = request.POST["nombre"]
        os.chdir(base_dir)
        os.mkdir(name_folder)
    except Exception as e:
        return JsonError(str(e))

    return JsonResponse({"nombre": name_folder, "tipo": "dir"})