import * as Sortable from "sortablejs";
import type { App } from "vue";

const SortableTable = (el: any, _binding: any, vnode: any) => {
  const sortableElement = el.getElementsByTagName("tbody")[0];
  const options = {
    handle: ".sortHandle",
    animation: 150,
    onUpdate: function (event: any) {
      vnode.ctx?.emit("sorted", event);
    },
  };
  Sortable.create(sortableElement, options);
};

function install(Vue: App): void {
  Vue.directive("sortable-table", SortableTable);
}

export default install;
