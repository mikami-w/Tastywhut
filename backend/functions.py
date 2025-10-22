import time, os, sys
from flask import request
import database_op as dbop

url_root = "https://www.tastywhut.site"
# url_root="http://2l35209f44.iok.la"


def get_abs_dir(rela_dir):
    dir_path = os.path.abspath(os.path.join(os.path.split(sys.argv[0])[0]))
    return dir_path + "/" + rela_dir


def random_name_time():
    return str(int(time.time()))


def image_url_avatar(filename):
    return url_root + "getpic_avatar?filename=" + filename


def image_url(filename):
    return url_root + "getpic?filename=" + filename


def get_userinfo(openid):
    # 根据openid返回username和avatar,索引分别为0,1
    sql = 'SELECT username,avatar FROM users WHERE openid="{}"'.format(openid)
    result = dbop.search(sql)
    if result:
        return result[0]
    else:
        return False


if __name__ == "__main__":
    print(get_abs_dir("image/i.9"))
    dir_path = os.path.abspath(os.path.join(os.path.split(sys.argv[0])[0]))
    print(dir_path)
