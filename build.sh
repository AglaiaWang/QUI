# 先清空 dist
rm -rf dist
mkdir dist

# 对 page 文件夹下的每一个 name 都进行构建
cd ./demo/page
for name in $(ls)
do
    echo building $name ...
    npm run parcel:build -- demo/page/$name/index.html -d dist/$name --detailed-report
done
