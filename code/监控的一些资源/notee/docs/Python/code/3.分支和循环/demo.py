
# if a > b:
#   print('go to 1')
# else:
#   print('go to 2')

# account = 'zwh'
# password = '123456'

# print('input account')
# user_account = input()

# print('input password')
# user_password = input()

# if account == user_account and password == user_password :
#   print('ok')
# else:
#   print('err')

# count = 0
# while count < 5:
#   count +=1
#   print(count)
# else:
#   print('循环完成')

# for循环，主要遍历/循环序列、集合和字典(else可省略)
# break: 终止当前循环(如有else不会执行)，continue: 跳出本次循环
# a = [1, 2, 3]
# for item in a:
#   print(item)
#   break
#   continue
# else:
#   print('循环完成')


a = [1,2,3,4,5,6,7,8]
b = a[0:len(a):2]
print(b)