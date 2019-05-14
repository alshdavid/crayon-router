import { matchPath, normalise } from './url'

it('Should normalise a path', () => {
    for (const test of incomingPaths) {
        const result = normalise(test.pathname)
        expect(result).toEqual(test.normalise)
    }
})

it('Should match incoming paths to correct param objects', () => {
    for (const test of incomingPaths) {
        const result = matchPath(test.pattern, test.pathname)
        expect(result).toEqual(test.params)
    }
})

var incomingPaths = [
    {
        pattern: '',
        pathname: '/',
        params: {},
        normalise: ''
    },
    {
        pattern: '',
        pathname: '',
        params: {},
        normalise: ''
    },
    {
        pattern: '/',
        pathname: '',
        params: {},
        normalise: ''
    },
    {
        pattern: '/',
        pathname: '/',
        params: {},
        normalise: ''
    },
    {
        pattern: '/yes',
        pathname: '/yes',
        params: {},
        normalise: '/yes'
    },
    {
        pattern: '/yes',
        pathname: '/yes/',
        params: {},
        normalise: '/yes'
    },
    {
        pattern: '/yes/',
        pathname: '/yes/',
        params: {},
        normalise: '/yes'
    },
    {
        pattern: '/yes/',
        pathname: '/yes',
        params: {},
        normalise: '/yes'
    },
    {
        pattern: '/:id',
        pathname: '/12',
        params: { id: '12' },
        normalise: '/12'
    },
    {
        pattern: '/:id',
        pathname: '/',
        params: undefined,
        normalise: ''
    },
    {
        pattern: '/:id',
        pathname: '/no/path',
        params: undefined,
        normalise: '/no/path'
    },
    {
        pattern: '/:id',
        pathname: '/yes',
        params: { id: 'yes' },
        normalise: '/yes'
    },
    {
        pattern: '/:id/path',
        pathname: '/yeS/Path',
        params: { id: 'yes' },
        normalise: '/yes/path'
    },
    {
        pattern: '/:id/:id2',
        pathname: '/yes/yes2',
        params: { id: 'yes', id2: 'yes2' },
        normalise: '/yes/yes2'
    },
    {
        pattern: '/:id/:id2/path',
        pathname: '/yes/yes2/path',
        params: { id: 'yes', id2: 'yes2' },
        normalise: '/yes/yes2/path'
    },
    {
        pattern: '/:id/:id2/path',
        pathname: '/yes/yes2/NO',
        params: undefined,
        normalise: '/yes/yes2/no'
    },
    {
        pattern: '/**',
        pathname: '/yes',
        params: {},
        normalise: '/yes'
    },
    {
        pattern: '/**',
        pathname: '/yes/yes',
        params: {},
        normalise: '/yes/yes'
    },
    {
        pattern: '/**',
        pathname: '/',
        params: {},
        normalise: ''
    },
    {
        pattern: '/yes/**',
        pathname: '/yes/yes',
        params: {},
        normalise: '/yes/yes'
    },
    {
        pattern: '/yes/yes/yes/**',
        pathname: '/yes/yes/yes/path/going/on',
        params: {},
        normalise: '/yes/yes/yes/path/going/on'
    },
    {
        pattern: '/yes/**',
        pathname: '/no/path',
        params: undefined,
        normalise: '/no/path'
    },
    {
        pattern: '/:id/**',
        pathname: '/yes/path',
        params: { id: 'yes' },
        normalise: '/yes/path'
    },
    {
        pattern: '/somewhere/:id/**',
        pathname: '/somewhere/yes/path/going/on',
        params: { id: 'yes' },
        normalise: '/somewhere/yes/path/going/on'
    }
]