import './styles.scss'
import crayon from 'crayon';
import react from 'crayon-react';
import React from 'react';

const router = crayon.create('main')  

const target = (document.getElementById('router-outlet') as any)
router.use(react.router(target))

router.path('/', (req, res) => res.mount(() => <div>Root Path</div>))
router.path('/page-1', (req, res) => res.mount(() => <div>Page 1</div>))

router.load()
