import Vue from 'vue';

let eventbus = new Vue();

eventbus.on = eventbus.$on;
eventbus.emit = eventbus.$emit;
export default eventbus;
