<template>
    <button class="v-button"
            @click="handleClick"
            :disabled="disabled || loading"
            :type="nativeType"
            :class="[
                type ? 'v-button--' + type : '',
                size ? 'v-button--' + size : '',
                {
                    'is-disabled': disabled,
                    'is-loading': loading,
                    'is-circle': circle
                }
    ]">
        <i :class="icon" v-if="icon"></i>
        <span v-if="$slots.default" :class="{hidden: loading, show: !loading}"><slot></slot></span>
        <div class="v-button-loading" v-if="loading">
            <i class="iconfont icon-loading2 loading-item"></i>
        </div>
    </button>
</template>
<script>
export default {
    name: 'VButton',
    props: {
        type: { type: String, default: 'default' },
        size: { type: String, default: 'small' },
        icon: { type: String, default: '' },
        nativeType: { type: String, default: 'button' },
        loading: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        circle: { type: Boolean, default: false }
    },
    methods: {
        handleClick (event) {
            this.$emit('click', event)
        }
    }
}
</script>

<style scoped>
.v-button{
    display:inline-block;
    line-height:1;
    white-space:nowrap;
    cursor:pointer;
    background:#fff;
    border:1px solid #dcdfe6;
    color:#606266;
    -webkit-appearance:none;
    text-align:center;
    box-sizing:border-box;
    outline:0;
    margin:0;
    transition:.1s;
    font-weight:500;
    -webkit-user-select:none;
    padding:6px 12px;
    font-size:14px;
    border-radius:2px;
}
.v-button [class*=el-icon-]+span{
    margin-left:5px;
}

/* default button style*/
.v-button.is-disabled,
.v-button.is-disabled:focus,
.v-button.is-disabled:hover{
    color:#c0c4cc;
    cursor:not-allowed;
    background-image:none;
    background-color:#fff;
    border-color:#ebeef5
}
.v-button:focus,
.v-button:hover{
    color:rgba(90, 100, 170, 0.7);
    border-color:rgba(90, 100, 170, 0.7);
    outline:0;
    border-radius:2px;
}
.v-button:active{
    color:rgb(90, 100, 170);
    border-color: rgb(90, 100, 170);
    outline:0;
}

/* primary button style*/
.v-button.v-button--primary{
    color:#fff;
    background-color:rgb(90, 100, 170);
    border-color:rgb(90, 100, 170);
}
.v-button--primary.is-disabled,
.v-button--primary.is-disabled:active,
.v-button--primary.is-disabled:focus,
.v-button--primary.is-disabled:hover{
    color:#fff;
    cursor:not-allowed;
    background-color:rgba(90, 100, 170, 0.7);
    border-color:rgba(90, 100, 170, 0.7);
}
.v-button--primary:hover{
    background:rgba(90, 100, 170, 0.7);
    border-color:rgba(90, 100, 170, 0.7);
    color:#fff;
}
.v-button--primary:active{
    background:rgb(90, 100, 170);
    border-color:rgb(90, 100, 170);
    color:#fff;
}

/* info button style*/
.v-button.v-button--info{
    color:#575F96;
    background-color:#d9d9dd;
    border-color:#d9d9dd;
}
.v-button--info.is-disabled,
.v-button--info.is-disabled:active,
.v-button--info.is-disabled:focus,
.v-button--info.is-disabled:hover{
    color:#575F96;
    cursor:not-allowed;
    background-color:#e4e4ee;
    border-color:#e4e4ee;
}
.v-button--info:hover{
    background:#e4e4ee;
    border-color:#e4e4ee;
    color:#575F96;
}
.v-button--info:active{
    background:#d9d9dd;
    border-color:#d9d9dd;
    color:#575F96;
}

/* text button style*/
.v-button.v-button--text{
    color:#303133;
    background-color:transparent;
    border: none;
    outline: 0;
    border-radius: 0;
}
.v-button--text.is-disabled,
.v-button--text.is-disabled:active,
.v-button--text.is-disabled:focus,
.v-button--text.is-disabled:hover{
    cursor:not-allowed;
    color: #909399;
    background-image:none;
    background-color:transparent;
    border: none;
    outline: 0;
    border-radius: 0;
}
.v-button--text:hover{
    background:#e9e9f1;
    border: none;
    color:rgb(90, 100, 170);
    outline: 0;
    border-radius: 0;
}
.v-button--text:active{
    background:transparent;
    border: none;
    color:#303133;
    outline: 0;
    border-radius: 0;
}

/* mini button style*/
.v-button--mini{
    font-size: 12px;
    padding: 4px 8px;
}

/* medium button style*/
.v-button--medium{
    font-size: 14px;
    padding: 10px 20px;
}

/* circle button style*/
.v-button.is-circle{
    border-radius:50%;
    padding:12px;
}

/* loading style*/
.v-button.is-loading{
    position:relative;
    pointer-events:none
}
.v-button-loading{
    position:absolute;
    pointer-events:none;
    left:-1px;
    top:-1px;
    right:-1px;
    bottom:-1px;
    border-radius:inherit;
    background-color:rgba(30,30,30,0.6);
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hidden{
    opacity: 0.1;
}
.show{
    opacity: 1;
}
.loading-item{
    animation: rotate 1000ms linear infinite
}
@keyframes rotate {
    0% {transform: rotate(0deg)}
    100%  {transform: rotate(360deg)}
}
</style>
