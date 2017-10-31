var store = {
	save(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	},
	fetch(key){
		return JSON.parse(localStorage.getItem(key)) || [];//取值失败返回空
	}
};

// var arr = [
// 	{
// 		title: "吃饭打豆豆1",
// 		isChecked: false
// 	},
// 	{
// 		title: "吃饭打豆豆2",
// 		isChecked: false
// 	}
// ];
var list = store.fetch("todolist");
var filter ={
	all:function (list) {
		return list;
	},
	finished:function (list) {
		return list.filter(function(item) {
			return item.isChecked;
		})
	},
	unfinished:function (list) {
		return list.filter(function(item) {
			return !item.isChecked;
		})
	}
};
var vm = new Vue({
	el: ".main",
	data: {
		list:list,
		todo:"",
		editTodos:"", //记录正在编辑的数据
		beforeTitle:"",//保存之前的title
		visibility:"all"
	},
	watch:{
		/*list:function () {//监控list这个属性，发生变化时执行函数
			store.save("todolist",this.list)
		}*/
		list:{
			handler:function () {
				store.save("todolist",this.list)
			},
			deep:true //深度监控，包括属性
		}
	},
	computed:{
		allLength:function () {
			return this.list.length;
			// return this.list.filter(function(a){return !a.isChecked}).length;
			// return this.list.filter(this.list.isChecked).length;
		},
		unfinishedLength:function () {
			return this.list.filter(function(a){return !a.isChecked}).length;
			// return this.list.filter(function(a){return !a.isChecked}).length;
			// return this.list.filter(this.list.isChecked).length;
		},
		finishedLength:function () {
			return this.list.filter(function(a){return a.isChecked==true}).length;
			// return this.list.filter(function(a){return !a.isChecked}).length;
			// return this.list.filter(this.list.isChecked).length;
		},
		filterList:function () {//过滤list，有三种情况，all，完成，未完成
			return filter[this.visibility]?filter[this.visibility](list):list;
		}
	},
	methods:{
		addTodo(){
			//this指向当前这个根实例
			// console.log(ev);
			if(this.todo != ""){
				this.list.push({
					// title: ev.target.value
					title: this.todo,
					isChecked: false
				});
				this.todo = "";
			}
			else{
				alert("不能为空，谢谢配合")
			}
		},
		// deleteTodo(todo){
		// 	var index = this.list.indexOf(todo);
		// 	this.list.splice(index,1);
		// }
		deleteTodo(item){
			var index = this.list.indexOf(item);
			this.list.splice(index,1);
		},
		editTodo(todo){//编辑任务时记录原title，方便取消重新赋值
			this.editTodos = todo;
			this.beforeTitle = todo.title;
		},
		editedTodo(){
			this.editTodos = "";
		},
		cancelTodo(todo){
			todo.title = this.beforeTitle;
			this.editTodos = "";
		}
	},
	directives:{
		"focus":{
			update(el,binding){
				// console.log(el);
				// console.log(binding);
				if (binding.value) {
					el.focus();
				}
			}
		}
	}
});

function watchHashChange() {
	var hash = window.location.hash.slice(1);
	vm.visibility = hash;
	console.log(hash);
};
watchHashChange();
window.addEventListener("hashchange",watchHashChange);



