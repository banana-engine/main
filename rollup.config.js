import terser     from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import resolve    from '@rollup/plugin-node-resolve'
import tsconfig   from './tsconfig.json'

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/banana.js',
        format: 'iife',
        name: 'Banana'
    },
    plugins: [
        resolve({
            browser: true,
            extensions: ['.js', '.ts']
        }),
        typescript(),
        terser()
    ]
}