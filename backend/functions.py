import time, os
from flask import request


def get_abs_dir(rela_dir):
    return os.path.dirname(__file__) + "\\" + rela_dir


def random_name_time():
    return str(int(time.time()))


def image_url_avatar(filename):
    return "https://47.97.50.124/getpic_avatar?filename=" + filename


def image_url(filename):
    return "https://47.97.50.124/getpic?filename=" + filename
    # return request.url_root + "getpic?filename=" + filename


if __name__ == "__main__":
    print(get_abs_dir("image\\i.9"))
    print(__file__)
