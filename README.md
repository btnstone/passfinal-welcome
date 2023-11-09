# 初始化数据库
npx prisma migrate dev --name init

如果数据库有更新，需要再次生成，name 可以随便写
npx prisma migrate dev --name add-avatar-url
重新生成Prisma客户端：每次修改schema.prisma文件后，你需要重新生成Prisma客户端以确保你的代码更改得到反映：
npx prisma generate

