import { handlerFunc } from '../types'
import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from '../mount';
import { ReactMounter } from './mounter';

export const router = (): handlerFunc => (req, res, state) => {   
    if (!state.vue) {
        state.vue = {
            mounter: new ReactMounter(),
        }
    }
    res.mount = (Component: any): Promise<any> => {
        const mounter = state.vue.mounter
        return mount(
            Component,
            mounter,
            res.ctx.animation.name,
            res.ctx.animation.duration
        )
    }
}