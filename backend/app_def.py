import PIL.Image
from flask import Flask, request, jsonify, make_response, abort, send_file
from factory import create_app
import database_op as dbop
import json, requests, io, PIL, os, cv2, re
import functions as func
import numpy as np

app = create_app()

url_access_token = "https://api.weixin.qq.com/sns/jscode2session"


# 正式
appid = "wx079704ad8fc2ab4f"
app_secret = "51c694615b572fb7c41f6f9406495f58"

# sy测试
# appid = "wx7742ccf7fddba233"
# app_secret = "ed44f832672dc4648126d5c2819dd332"


@app.route("/")
def start():
    return "Index"


# @app.route("/test")
# def listtest():
#     te = request.url_root
#     url = "http://2l35209f44.iok.la/add_shop_image"
#     files = {
#         "image": open("D:/works/vscode/py/flask_tutorial/flaskr/image/hinako.jpg", "rb")
#     }
#     response = requests.post(url, files=files)
#     return ""


# 请求 校内 校外 rank 排序后的数据
@app.route("/data/<request_page>")
def data_request_page(request_page):

    if request_page == "incampus":
        statement1 = "WHERE shops.incampus=1 "
    elif request_page == "outcampus":
        statement1 = "WHERE shops.incampus=0 "
    elif request_page == "rank":
        statement1 = ""
    else:
        abort(400)

    page = int(request.args.get("page"))
    limit = int(request.args.get("limit"))

    head = "id,name,phone,address,openinghour,image,ROUND(AVG(comments.stars),2)"
    sql1 = """
    SELECT {} FROM comments 
    RIGHT JOIN shops ON comments.shop_id=shops.id 
    {}
    GROUP BY shops.id 
    ORDER BY ROUND(AVG(comments.stars),2) DESC,shops.id DESC 
    LIMIT {},{};
    """.format(
        head, statement1, (page - 1) * limit, limit
    )

    shoplist = []
    result = dbop.search(sql1)

    sql2 = "SELECT COUNT(*) FROM shops {};".format(statement1)
    count = dbop.search(sql2)[0][0]
    # print(count)

    columns = ["id", "name", "phone", "address", "openinghour", "image", "star"]

    try:
        for ele in result:
            shoplist.append(dict(zip(columns, list(ele))))

        response = make_response(jsonify(shoplist))
        response.headers["total-count"] = count
        return response
    except:
        return []


# 根据id精确返回shop信息
@app.route("/query")
def data_request_exact():

    id = int(request.args.get("id"))

    head = "id,name,phone,address,openinghour,image,ROUND(AVG(comments.stars),2)"
    sql1 = "SELECT {} FROM comments RIGHT JOIN shops ON comments.shop_id=shops.id WHERE shops.id={};".format(
        head, id
    )

    shoplist = []
    result = dbop.search(sql1)

    sql2 = "SELECT image FROM shops WHERE id={0}".format(id)
    imgt = dbop.search(sql2)

    columns = [
        "id",
        "name",
        "phone",
        "address",
        "openinghour",
        "notes",
        "star",
        "image",
    ]

    for ele in result:
        shoplist.append(dict(zip(columns, list(ele))))

    response = make_response(jsonify(shoplist))
    response.headers["total-count"] = len(shoplist)
    return response


# 按照foodid返回food评论
@app.route("/data/food")
def data_request_food_comment():

    food_id = request.args.get("id")
    food_id = re.sub(r"\s+", "", food_id)
    page = int(request.args.get("page"))
    limit = int(request.args.get("limit"))

    sql2 = "SELECT COUNT(*) FROM comments"
    count = dbop.search(sql2)

    head = "cmnt_id,username,content,likes,stars"
    sql = "SELECT {0} FROM comments WHERE food_id={1} LIMIT {2},{3}".format(
        head, food_id, (page - 1) * limit, limit
    )

    commentslist = []
    result = dbop.search(sql)
    columns = ["id", "username", "comment", "like", "star"]

    for ele in result:
        commentslist.append(dict(zip(columns, list(ele))))

    response = make_response(jsonify(commentslist))
    response.headers["total-count"] = count[0][0]
    return response


# 按照shopid返回food评论
@app.route("/data/shopcomment")
def data_request_shop_comment():

    shop_id = re.sub(r"\s+", "", request.args.get("id"))
    openid = re.sub(r"\s+", "", request.args.get("openid"))  # 前端待完成

    page = int(request.args.get("page"))
    limit = int(request.args.get("limit"))

    sql2 = "SELECT COUNT(*) FROM comments WHERE shop_id={}".format(shop_id)
    count = dbop.search(sql2)

    # userinfo=func.get_userinfo(openid)

    # openid在索引0,return时切片去掉
    head = "user_openid,cmnt_id,content,likes,stars,IF(user_openid='{}',1,0)".format(
        openid
    )
    sql = "SELECT {} FROM comments WHERE shop_id={} LIMIT {},{}".format(
        head, shop_id, (page - 1) * limit, limit
    )

    commentslist = []
    result = dbop.search(sql)
    columns = ["id", "comment", "like", "star", "isowner", "username", "userimg"]

    for ele in result:
        userinfo = list(func.get_userinfo(ele[0]))
        # print(userinfo)
        ele = list(ele) + userinfo
        # print(ele)
        commentslist.append(dict(zip(columns, ele[1:])))

    # 使自己的评论在列表前面
    commentslist.sort(key=lambda elem: elem["isowner"], reverse=True)

    # print(commentslist)

    response = make_response(jsonify(commentslist))
    response.headers["total-count"] = count[0][0]
    return response


# 获取图片
@app.route("/getpic")
def getpic():
    filename = request.args.get("filename")
    path = "image/" + filename
    return send_file(path, mimetype="image/jpeg/png")


@app.route("/getpic_avatar")
def getpic_a():
    filename = request.args.get("filename")
    path = "image/avatars/" + filename
    return send_file(path, mimetype="image/jpeg/png")


# 接受并存储shop图片
@app.route("/add_shop_image", methods=["POST"])
def add_shop_image():
    filename = func.random_name_time() + ".png"
    path = func.get_abs_dir("image/") + filename
    imgbytes = request.files["file"]
    image = PIL.Image.open(imgbytes)
    image.save(path)
    return func.image_url(filename)


# 接受并存储avatar图片
@app.route("/add_avatar_image", methods=["POST"])
def add_avatar_image():
    filename = func.random_name_time() + ".png"
    path = func.get_abs_dir("image/avatars/") + filename
    imgbytes = request.files["file"]
    image = PIL.Image.open(imgbytes)
    image.save(path)
    return func.image_url_avatar(filename)


# 添加店铺
@app.route("/add_shop", methods=["POST"])
def addshop():
    # d = {"name": "me", "phone": "111"}
    # requests.post(request.root_url + "add_shop", data=d)
    name = re.sub(r"\s+", "", request.form["name"])
    phone = re.sub(r"\s+", "", request.form["phone"])
    address = re.sub(r"\s+", "", request.form["address"])
    image = re.sub(r"\s+", "", request.form["image"])
    openinghour = re.sub(r"\s+", "", request.form["openinghour"])
    incampus = int(request.form["incampus"])
    if "notes" in request.form:
        notes = re.sub(r"\s+", "", request.form["notes"])
    else:
        notes = ""

    head = "name,phone,address,image,openinghour,incampus,notes"
    val = '"{}","{}","{}","{}","{}",{},"{}"'.format(
        name, phone, address, image, openinghour, incampus, notes
    )
    sql = "INSERT INTO shops({}) VALUES({})".format(head, val)
    print(sql)
    # print(request.form)
    dbop.insert(sql)
    return "True"


# 添加评论
@app.route("/add_comment", methods=["POST"])
def addcomment():
    shop_id = int(request.form["shopid"])
    content = re.sub(r"\s+", "", request.form["content"])
    # username = re.sub(r"\s+", "", request.form["userid"])
    user_openid = re.sub(r"\s+", "", request.form["openid"])
    # user_avatar = re.sub(r"\s+", "", request.form["userimg"])
    stars = float(request.form["score"])

    head = "shop_id,content,stars,user_openid"
    # val = '{},"{}","{}","{}",{},"{}"'.format(
    #     shop_id, content, username, user_avatar, stars, user_openid
    # )
    val = '{},"{}",{},"{}"'.format(shop_id, content, stars, user_openid)
    sql = "INSERT INTO comments({}) VALUES({})".format(head, val)
    dbop.insert(sql)
    return request.form


# 根据code得到并返回openid,并创建新用户
@app.route("/getopenid", methods=["GET"])
def getopenid():
    code = request.args.get("code")
    # https://api.weixin.qq.com/sns/oauth2/access_token?
    # appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
    params = "?appid={}&secret={}&js_code={}&grant_type=authorization_code".format(
        appid, app_secret, code
    )
    response = requests.get(url_access_token + params)
    rdata = response.json()
    print(rdata)
    if "openid" in rdata:
        openid = rdata["openid"]
    else:
        print("Error in getting openid!")
        return "Error in getting openid!"
    sql = 'SELECT username,avatar FROM users WHERE openid="{}"'.format(openid)
    data = dbop.search(sql)

    # print(data)
    if len(data):
        return {"openid": openid, "nickname": data[0][0], "avatar": data[0][1]}
    else:
        # 如果是新openid，那就创建并返回空白的nickname和avatar
        sql = 'INSERT INTO users(openid,username,avatar) VALUES ("{}","微信用户{}","{}");'.format(
            openid, openid[-6:], func.image_url_avatar("Akkarin.jpg")
        )
        dbop.insert(sql)
        return {
            "openid": openid,
            "nickname": "微信用户{}".format(openid[0:6]),
            "avatar": func.image_url_avatar("Akkarin.jpg"),
        }


# 更新用户信息
@app.route("/updateuserinfo", methods=["POST"])
def updateuserinfo():
    # post提交openid，avatar，nickname，然后通过openid保存相应其余数据
    openid = re.sub(r"\s+", "", request.form["openid"])
    nickname = re.sub(r"\s+", "", request.form["nickname"])
    avatar = re.sub(r"\s+", "", request.form["avatar"])
    sql = 'UPDATE users SET username="{}",avatar="{}" WHERE openid="{}";'.format(
        nickname, avatar, openid
    )
    if not dbop.update(sql) == dbop.dberror:
        return "Saved!"
    else:
        return "Error!(route:adduserinfo)"


# 收藏店铺，收藏数据写入数据库
@app.route("/addcollection", methods=["POST"])
def addcollection():
    openid = re.sub(r"\s+", "", request.form["openid"])
    shop_liked = re.sub(r"\s+", "", request.form["shopid"])

    sql = 'INSERT INTO shop_collection(openid,shop_id) VALUES("{}",{});'.format(
        openid, shop_liked
    )

    if not dbop.insert(sql) == dbop.dberror:
        return "Data Written."
    else:
        return "Error!(route:addcollection)"


# 取消收藏
@app.route("/removecollection", methods=["POST"])
def removecollection():
    openid = re.sub(r"\s+", "", request.form["openid"])
    shop_unliked = re.sub(r"\s+", "", request.form["shopid"])

    sql = 'DELETE FROM shop_collection WHERE openid="{}" AND shop_id={};'.format(
        openid, shop_unliked
    )

    if not dbop.delete(sql) == dbop.dberror:
        return "Collection Removed."
    else:
        return "Error!(route:removecollection)"


# 根据用户openid显示收藏店铺
@app.route("/usercollection", methods=["POST"])
def usercollection():
    openid = re.sub(r"\s+", "", request.form["openid"])

    page = int(request.form["page"])
    limit = int(request.form["limit"])

    head = "id,name,phone,address,openinghour,image,ROUND(AVG(comments.stars),2)"
    sql1 = """
    SELECT {} FROM comments 
    RIGHT JOIN shops ON comments.shop_id=shops.id 
    RIGHT JOIN shop_collection ON shop_collection.shop_id=shops.id 
    WHERE shop_collection.openid=\"{}\" 
    GROUP BY shops.id 
    LIMIT {},{};
    """.format(
        head, openid, (page - 1) * limit, limit
    )

    shoplist = []
    result = dbop.search(sql1)

    sql2 = 'SELECT COUNT(*) FROM shop_collection WHERE openid="{}";'.format(openid)
    count = dbop.search(sql2)[0][0]
    # print(count)

    columns = ["id", "name", "phone", "address", "openinghour", "image", "star"]

    try:
        for ele in result:
            shoplist.append(dict(zip(columns, list(ele))))

        response = make_response(jsonify(shoplist))
        response.headers["total-count"] = count
        return response
    except:
        return []


# 检查某店铺是否被某用户收藏
@app.route("/isliked", methods=["POST"])
def is_liked():
    # print(request.form)
    openid = re.sub(r"\s+", "", request.form["openid"])
    shopid = int(request.form["shopid"])

    sql = 'SELECT shop_id FROM shop_collection WHERE openid="{}" AND shop_id={} LIMIT 1;'.format(
        openid, shopid
    )
    result = dbop.search(sql)
    return str(bool(len(result)))


# 模糊搜索
@app.route("/fuzzysearch", methods=["POST"])
def fuzzysearch():
    keywords = re.sub(r"\s+", "", request.form["keywords"])
    page = int(request.form["page"])
    limit = int(request.form["limit"])

    head = "id,name,phone,address,openinghour,image,ROUND(AVG(comments.stars),2)"
    sql1 = """
    SELECT {} FROM comments 
    RIGHT JOIN shops ON comments.shop_id=shops.id 
    WHERE name LIKE '%{}%' OR address LIKE '%{}%' 
    GROUP BY shops.id 
    ORDER BY ROUND(AVG(comments.stars),2) DESC,shops.id DESC
    LIMIT {},{};
    """.format(
        head, keywords, keywords, (page - 1) * limit, limit
    )  # MySQL排序不稳定,相同数据两次排序结果可能不同, 需要值唯一的第二排序关键字使排序稳定

    shoplist = []
    result = dbop.search(sql1)

    sql2 = "SELECT COUNT(*) FROM shops WHERE name LIKE '%{}%';".format(keywords)
    count = dbop.search(sql2)[0][0]

    columns = ["id", "name", "phone", "address", "openinghour", "image", "star"]

    try:
        for ele in result:
            shoplist.append(dict(zip(columns, list(ele))))

        # print(shoplist)

        response = make_response(jsonify(shoplist))
        response.headers["total-count"] = count
        return response
    except:
        return []


# 删除评论
@app.route("/deletecomment", methods=["POST"])
def deletecomment():
    commentid = int(request.form["commentid"])
    openid = re.sub(r"\s+", "", request.form["openid"])

    sql = 'DELETE FROM comments WHERE cmnt_id={} AND user_openid="{}";'.format(
        commentid, openid
    )
    try:
        dbop.delete(sql)

        return "True"
    except:
        return "False"
