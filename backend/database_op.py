import pandas as pd
import sqlalchemy, pymysql

dberror = -1


# 返回的是元组，每条数据是元组内的元组
def search(sql):
    db = pymysql.connect(
        host="127.0.0.1", user="root", password="Sy@20050401", database="tastywhut"
    )

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
    db = pymysql.connect(
        host="127.0.0.1", user="root", password="Sy@20050401", database="tastywhut"
    )

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
    db = pymysql.connect(
        host="127.0.0.1", user="root", password="Sy@20050401", database="tastywhut"
    )

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
    db = pymysql.connect(
        host="127.0.0.1", user="root", password="Sy@20050401", database="tastywhut"
    )

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
    db = pymysql.connect(
        host="127.0.0.1", user="root", password="Sy@20050401", database="tastywhut"
    )

    cursor = db.cursor()

    sql = "select username,avatar from users where openid=1;"
    try:
        cursor.execute(sql)
        result = cursor.fetchall()
        print(result)
        print(len(result))
        for tu in result:
            print(tu)

    except:
        print("error!")

    db.close()
