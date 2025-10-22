import pandas as pd
import sqlalchemy, pymysql

dberror = -1


def connectdatabase():
    database = pymysql.connect(
        host="47.97.50.124", user="root", password="Sy@20050401", database="tastywhut"
    )
    return database


# 返回的是元组，每条数据是元组内的元组
def search(sql):
    # db = pymysql.connect(
    #     host="47.97.50.124", user="root", password="Sy@20050401", database="tastywhut"
    # )
    db = connectdatabase()

    cursor = db.cursor()

    try:
        cursor.execute(sql)
        result = cursor.fetchall()

        cursor.close()
        db.close()
        return result

    except:
        print("\nerror in search!")
        print(sql + "\n")

        cursor.close()
        db.close()
        return dberror


def insert(sql):
    db = connectdatabase()

    cursor = db.cursor()

    try:
        cursor.execute(sql)
        db.commit()

        cursor.close()
        db.close()
        return 1

    except:
        print("\nerror in insert!")
        print(sql + "\n")
        db.rollback()

        cursor.close()
        db.close()
        return dberror


def update(sql):
    db = connectdatabase()

    cursor = db.cursor()

    try:
        cursor.execute(sql)
        db.commit()

        cursor.close()
        db.close()
        return 1

    except:
        print("\nerror in update!")
        print(sql + "\n")
        db.rollback()

        cursor.close()
        db.close()
        return dberror


def delete(sql):
    db = connectdatabase()

    cursor = db.cursor()

    try:
        cursor.execute(sql)
        db.commit()

        cursor.close()
        db.close()
        return 1
    except:
        print("\nerror in delete!")
        print(sql + "\n")
        db.rollback()

        cursor.close()
        db.close()
        return dberror


if __name__ == "__main__":
    db = connectdatabase()

    # cursor = db.cursor()

    # sql = (
    #     "select username,avatar from users where openid='oyUMQ7a0Fe9GlQOsDb1QdiWNAhbw';"
    # )

    # openid = "oyUMQ7ZsdKoiQRI1JMNbXENbF0_g"
    # sql = 'SELECT shop_id FROM shop_collection WHERE openid="{}" LIMIT 1;'.format(
    #     openid
    # )
    # try:
    #     cursor.execute(sql)
    #     result = cursor.fetchall()
    #     print(result)
    #     print(len(result))
    #     for tu in result:
    #         print(tu)

    # except:
    #     print("error!")

    openid = "oyUMQ7ZsdKoiQRI1JMNbXENbF0_g"
    shopid = 18

    sql = 'SELECT shop_id FROM shop_collection WHERE openid="{}" AND shop_id={} LIMIT 1;'.format(
        openid, shopid
    )
    result = search(sql)
    print(bool(len(result)))

    db.close()
