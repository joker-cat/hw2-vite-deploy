<script>

import axios from 'axios';
export default {
    data() {
        return {
            pathname: window.location.pathname, //當前路徑
            hasCookie: document.cookie.includes('mycookieTest'), //是否有cookie
            userInfo: { //帳號密碼
                username: '',
                password: '',
            },
            userLogin: false, //是否登入
            userChoose: {}, //品項選擇
            putChoose: {}, //品項編輯
            products: [], //全部品項,
            addProduct: { //新增
                data: {
                    "title": "",
                    "category": "",
                    "origin_price": "",
                    "price": "",
                    "unit": "個",
                    "description": "",
                    "content": "",
                    "is_enabled": 0,
                    "imageUrl": "",
                    "imagesUrl": []
                }
            }
        }
    },
    created() {
        if (this.pathname === '/2023VUE_HW3/admin.html' && this.hasCookie === false) {
            this.$router.push('/');
        }
        if (this.hasCookie === true) {
            axios.defaults.headers.common['Authorization'] = document.cookie.replace(
                /(?:(?:^|.*;\s*)mycookieTest\s*\=\s*([^;]*).*$)|^.*$/,
                "$1",
            ); //意思是下次發axios請求時，會把token以headers一起發送。
            this.render();
        }
    },
    methods: {
        del(id) {
            axios
                .delete(`https://ec-course-api.hexschool.io/v2/api/joooker/admin/product/${id}`)
                .then((res) => {
                    if (res.data.success) {
                        this.hasCookie = res.data.success;
                        this.render();
                        alert('已刪除');
                    }
                }).catch((error) => {
                    console.log(error);
                })
        },
        put() {
            axios
                .put(`https://ec-course-api.hexschool.io/v2/api/joooker/admin/product/${this.putChoose.id}`, {
                    data: { ...this.putChoose }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.hasCookie = res.data.success;
                        this.render();
                        alert('已更改');
                    }
                }).catch((error) => {
                    console.log(error);
                })
        },
        editChoose(item) {
            this.putChoose = { ...item };
        },
        post() {
            this.pushImage();
            console.log(this.addProduct.data);
            axios
                .post('https://ec-course-api.hexschool.io/v2/api/joooker/admin/product', {
                    ...this.addProduct
                })
                .then((res) => {
                    if (res.data.success) {
                        this.hasCookie = res.data.success;
                        this.render();
                        this.reset();
                        alert('已新增');

                    }
                }).catch((error) => {
                    console.log(error);
                })
        },
        pushImage() {
            if (this.addProduct.data.imagesUrl.length === 5) return;
            let math = Math.floor(Math.random() * 50) + 1;
            for (let i = 1; i <= 5; i++) {
                this.addProduct.data.imagesUrl.push(`https://picsum.photos/id/${math + 5 * i}/500/300`)
            }
            this.addProduct.data.imageUrl = `https://picsum.photos/id/${math}/500/300`
        },
        login() {
            axios
                .post('https://ec-course-api.hexschool.io/v2/admin/signin', this.userInfo)
                .then((res) => {
                    let { token, expired } = res.data;
                    this.userLogin = res.data.success;
                    this.hasCookie = true;
                    document.cookie = `mycookieTest=${token};expires=${new Date(expired)};`;
                    token = document.cookie.replace(
                        /(?:(?:^|.*;\s*)mycookieTest\s*\=\s*([^;]*).*$)|^.*$/,
                        "$1",
                    );
                    axios.defaults.headers.common['Authorization'] = token; //意思是下次發axios請求時，會把token以headers一起發送。
                    console.log(axios.defaults.headers.common['Authorization']);
                    this.$router.push('/admin');
                }).catch((error) => {
                    console.log(error);
                })
        },
        checkLogin() {
            if (document.cookie.includes('mycookieTest') === false) {
                alert('未驗證');
                return
            }

            axios
                .post('https://ec-course-api.hexschool.io/v2/api/user/check')
                .then((res) => {
                    if (res.data.success) {
                        this.hasCookie = res.data.success;
                        alert('已驗證');
                    }
                }).catch((error) => {
                    console.log(error);
                })
        },
        detail(item) {
            this.userChoose = { ...item };
        },
        render() {
            axios
                .get('https://ec-course-api.hexschool.io/v2/api/joooker/admin/products')
                .then((res) => {
                    this.products = res.data.products;
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        reset() {
            this.addProduct.data = {
                "title": "",
                "category": "",
                "origin_price": "",
                "price": "",
                "unit": "個",
                "description": "",
                "content": "",
                "is_enabled": 0,
                "imageUrl": "",
                "imagesUrl": []
            }
        },
    },
    computed: {
        chooseIsNull() {
            return Object.keys(this.userChoose).length !== 0;
        },
        putChooseIsNull() {
            return Object.keys(this.putChoose).length !== 0;
        },
        isDisabled() {
            return (
                this.addProduct.data.title === "" ||
                this.addProduct.data.category === "" ||
                this.addProduct.data.origin_price === "" ||
                this.addProduct.data.price === "" ||
                this.addProduct.data.description === "" ||
                this.addProduct.data.content === "" ||
                this.addProduct.data.imageUrl === "" ||
                this.addProduct.data.imagesUrl.length === 0
            ) ?
                true : false;
        },
        putIs_enabled: {
            //因為API格式規定is_enabled接受0跟1，
            //而type="checkbox"用v-model控制時會傳回boolen
            //所以利用computed
            set(value) {
                this.putChoose.is_enabled = value ? 1 : 0;
            },
            get() {
                return this.putChoose.is_enabled === 0 ? false : true;
            }
        },
        changeIs_enabled: {
            //因為API格式規定is_enabled接受0跟1，
            //而type="checkbox"用v-model控制時會傳回boolen
            //所以利用computed
            set(value) {
                this.addProduct.data.is_enabled = value ? 1 : 0;
            },
            get() {
                return this.addProduct.data.is_enabled === 0 ? false : true;
            }
        }
    }
}
</script>
<template>
    <div id="app" class="container-lg">
        <div class="row py-3">
            <div class="col-lg-7 col-sm-12">
                <h2>產品列表</h2>
                <table class="table table-hover mt-4">
                    <thead>
                        <tr>
                            <th width="180">產品名稱</th>
                            <th width="50">
                                原價
                            </th>
                            <th width="50">
                                售價
                            </th>
                            <th width="80">
                                是否啟用
                            </th>
                            <th width="140">
                                查看細節
                            </th>
                            <th width="140">
                                管理
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, idx) in products" :key="item.id">
                            <td width="180">{{ item.title }}</td>
                            <td width="50">
                                {{ item.origin_price }}
                            </td>
                            <td width="50">
                                {{ item.price }}
                            </td>
                            <td width="80">
                                <span class="text-success" v-if="item.is_enabled === 1">啟用</span>
                                <span v-else>未啟用</span>
                            </td>
                            <td width="140">
                                <button type="button" class="btn btn-primary" @click="detail(item)">查看細節</button>
                            </td>
                            <td width="140">
                                <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal"
                                    data-bs-target="#putProductModal" @click="editChoose(item)">
                                    編輯
                                </button>
                                <button type="button" class="btn btn-outline-danger btn-sm" @click="del(item.id)">
                                    刪除
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="d-flex justify-content-between px-4">
                    <span class="align-self-center">目前有 {{ products.length }} 項產品</span>
                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#productModal">建立新的產品</button>
                </div>
            </div>
            <div class="col-lg-5 col-sm-12">
                <h2>單一產品細節</h2>
                <template v-if="chooseIsNull">
                    <div class="card mb-3">
                        <img :src="userChoose.imageUrl" class="card-img-top primary-image" alt="主圖">
                        <div class="card-body">
                            <h5 class="card-title">
                                {{ userChoose.title }}
                                <span class="badge bg-primary ms-2">{{ userChoose.category }}</span>
                            </h5>
                            <p class="card-text">商品描述：{{ userChoose.description }}</p>
                            <p class="card-text">商品內容：{{ userChoose.content }}</p>
                            <div class="d-flex">
                                <p class="card-text me-2">{{ userChoose.price }}</p>
                                <p class="card-text text-secondary"><del>{{ userChoose.origin_price }}</del></p>
                                元 / {{ userChoose.unit }}
                            </div>
                        </div>
                    </div>
                    <template v-for="(img, idx) in userChoose.imagesUrl" :key="img">
                        <img :src="img" alt="圖片error" class="images m-2">
                    </template>
                </template>
                <p class="text-secondary" v-if="!chooseIsNull">請選擇一個商品查看</p>
            </div>
            <!-- Modal -->
            <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-md">
                    <div class="modal-content border-0">
                        <div class="modal-header bg-dark text-white">
                            <h5 id="productModalLabel" class="modal-title">
                                <span>新增產品</span>
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="mb-3">
                                    <label for="addProductTitle" class="form-label col-3">商品名稱</label>
                                    <input type="text" class="form-label " id="addProductTitle"
                                        v-model="addProduct.data.title" placeholder="joooker小丑">
                                </div>
                                <div class="mb-3">
                                    <label for="addProductCategory" class="form-label col-3">系列</label>
                                    <input type="text" class="form-label " id="addProductCategory"
                                        v-model="addProduct.data.category" placeholder="搞怪系列">
                                </div>
                                <div class="mb-3">
                                    <label for="addProductOriginPrice" class="form-label col-3">原價</label>
                                    <input type="text" class="form-label " id="addProductOriginPrice"
                                        v-model.number="addProduct.data.origin_price" placeholder="原價">
                                </div>
                                <div class="mb-3">
                                    <label for="addProductPrice" class="form-label col-3">售價</label>
                                    <input type="text" class="form-label " id="addProductPrice"
                                        v-model.number="addProduct.data.price" placeholder="售價">
                                </div>
                                <div class="mb-3">
                                    <label for="addProductDescription" class="form-label col-3">商品描述</label>
                                    <input type="text" class="form-label " id="addProductDescription"
                                        v-model="addProduct.data.description" placeholder="描述">
                                </div>
                                <div class="mb-3">
                                    <label for="addProductContent" class="form-label col-3">商品內容</label>
                                    <input type="text" class="form-label " id="addProductContent"
                                        v-model="addProduct.data.content" placeholder="內容">
                                </div>
                                <div class="mb-3">
                                    <label for="addProductIs_enabled" class="form-label col-3">是否啟用</label>
                                    <input type="checkbox" class="form-label " id="addProductIs_enabled"
                                        v-model="changeIs_enabled" placeholder="內容">
                                </div>
                                <div class="mb-3">
                                    <div class="mb-2">
                                        <label for="imageUrl" class="form-label">圖片展示(按新增獲取假圖)</label>
                                        <img class="img-fluid" v-if="addProduct.data.imageUrl"
                                            :src="addProduct.data.imageUrl" alt="圖片ERR">
                                        <template v-for="(img, idx) in addProduct.data.imagesUrl" :key="img">
                                            <img :src="img" alt="圖片error" class="images m-2" style="width: 200px;">
                                        </template>
                                    </div>
                                    <div>
                                        <button type="button" class="btn btn-outline-primary btn-sm d-block w-100"
                                            @click="pushImage">
                                            新增圖片
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
                            <button type="button" class="btn btn-primary" @click="post" :disabled="isDisabled">新增衣服</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="putProductModal" ref="putProductModal" class="modal fade" tabindex="-1"
                aria-labelledby="putProductModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content border-0">
                        <div class="modal-header bg-danger text-white">
                            <h5 id="putProductModalLabel" class="modal-title">
                                <span>編輯產品</span>
                            </h5>
                        </div>
                        <div class="modal-body">
                            <template v-if="putChooseIsNull">
                                <form>
                                    <div class="mb-3">
                                        <label for="addProductTitle" class="form-label col-3">商品名稱</label>
                                        <input type="text" class="form-label " id="addProductTitle"
                                            v-model="putChoose.title" placeholder="joooker小丑">
                                    </div>
                                    <div class="mb-3">
                                        <label for="addProductCategory" class="form-label col-3">系列</label>
                                        <input type="text" class="form-label " id="addProductCategory"
                                            v-model="putChoose.category" placeholder="搞怪系列">
                                    </div>
                                    <div class="mb-3">
                                        <label for="addProductOriginPrice" class="form-label col-3">原價</label>
                                        <input type="text" class="form-label " id="addProductOriginPrice"
                                            v-model.number="putChoose.origin_price" placeholder="原價">
                                    </div>
                                    <div class="mb-3">
                                        <label for="addProductPrice" class="form-label col-3">售價</label>
                                        <input type="text" class="form-label " id="addProductPrice"
                                            v-model.number="putChoose.price" placeholder="售價">
                                    </div>
                                    <div class="mb-3">
                                        <label for="addProductDescription" class="form-label col-3">商品描述</label>
                                        <input type="text" class="form-label " id="addProductDescription"
                                            v-model="putChoose.description" placeholder="描述">
                                    </div>
                                    <div class="mb-3">
                                        <label for="addProductContent" class="form-label col-3">商品內容</label>
                                        <input type="text" class="form-label " id="addProductContent"
                                            v-model="putChoose.content" placeholder="內容">
                                    </div>
                                    <div class="mb-3">
                                        <label for="addProductIs_enabled" class="form-label col-3">是否啟用</label>
                                        <input type="checkbox" class="form-label " id="addProductIs_enabled"
                                            v-model="putIs_enabled" placeholder="內容">
                                    </div>
                                    <div class="mb-3">
                                        <div class="mb-2 text-center">
                                            <p>圖片展示</p>
                                            <img class="img-fluid" :src="putChoose.imageUrl" alt="圖片ERR">
                                            <template v-for="(img, idx) in putChoose.imagesUrl" :key="img">
                                                <img :src="img" alt="圖片error" class="images m-2" style="width: 200px;">
                                            </template>
                                        </div>
                                    </div>
                                </form>
                            </template>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                                取消
                            </button>
                            <button type="button" class="btn btn-danger" @click="put">
                                確認修改
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Modal -->
        </div>
    </div>
</template>