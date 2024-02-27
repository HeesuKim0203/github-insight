import * as d3 from 'd3'
import { JSDOM } from 'jsdom'
import { CommitContributionsByRepository, Repository, Language } from './type'
import write from './write'

const WIDTH = 1000
const HEIGHT = 600

let uidCounter = 0 

function uid(prefix) {
    return `${prefix}-${uidCounter++}`
}

export const createSvg = () => {

    const testData = require('../scripts/test.json')

    const data = testData.data.user.contributionsCollection.commitContributionsByRepository
    
    const colorData : (string | null)[] = []

    const test1 = data.reduce((prev : any, commitContributionsByRepository : CommitContributionsByRepository) => {
        if( commitContributionsByRepository.repository.primaryLanguage ) {
            const findIndex = prev.children.findIndex((color : any) => color.name === commitContributionsByRepository.repository.primaryLanguage?.name)
            const { 
                repository : { 
                    name : repositoryName, 
                    primaryLanguage : { 
                        name, 
                        color 
                    } 
                }, 
                contributions : {
                    totalCount
                }
            } = commitContributionsByRepository

            if( findIndex === -1 ) {
                prev.children.push({
                    name,
                    children : [{
                        name : repositoryName,
                        value : totalCount
                    }]
                })

                colorData.push(color)
            }else {
                prev.children[findIndex].children.push({
                    name : repositoryName,
                    value : totalCount
                })
            }
        }
        return prev
    }, { name : 'test', children : [] })

    const color = d3.scaleOrdinal(test1.children.map((d : any) => d.name), colorData.map((d : any) => d))

    const DOM = new JSDOM(
        '<!DOCTYPE html><html><body><div class="container"></div></body></html>'
    )

    const container = d3.select(DOM.window.document).select('.container')

    const root = d3.treemap()
        .tile(d3.treemapSquarify)
        .size([WIDTH, HEIGHT])
        .padding(1)
        .round(true)
        (d3.hierarchy(test1)
            .sum((d : any) => d.value)
            .sort((a : any, b : any) => b.value - a.value));

    // Create the SVG container.
    const svg = container.append('svg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;')

    // Add a cell for each leaf of the hierarchy.
    const leaf = svg.selectAll('g')
        .data(root.leaves())
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`)

    // Append a tooltip.
    const format = d3.format(',d')

    // leaf.append('text')
    //     .attr('style', 'font-size : 12px ; font-weight : 700 ;')
    //     .text((d : any) => {
    //         return `${d.ancestors().reverse().map((d : any) => d.data.name).join(".")}\n${format(d.value ? d.value : 0)}`
    //     })

    // Append a color rectangle. 
    leaf.append('rect')
        .attr('id', (d) => (d as any).leafUid = uid('leaf'))
        .attr('fill', (d: any) : string => {
            while (d.depth > 1) d = d.parent!
            return color(d.data.name) as string
        })
        .attr('fill-opacity', 0.6)
        .attr('width', (d : any) => d.x1 - d.x0)
        .attr('height', (d : any) => d.y1 - d.y0)
    
    // Append a clipPath to ensure text does not overflow.
    leaf.append('clipPath')
        .attr('id', (d : any) => ((d as any).clipUid = uid('clip')))
        .append('use')
        .attr('xlink:href', (d : any) => `#${(d as any).leafUid}`)

    // Append multiline text. The last line shows the value and has a specific formatting.
    leaf.append('text')
        .attr('clip-path', (d : any) => (d as any).clipUid)
        .selectAll('tspan')
        .data((d : any) => d.data.name?.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value)))
        .join('tspan')
        .attr('x', 3)
        .attr('y', (d : any, i : number, nodes : any) => {
            const num = (i === nodes.length - 1)
            return `${(num ? 1 : 0) * 0.3 + 1.1 + i * 0.9}em`
        })
        .attr('fill-opacity', (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
        .text((d : any) => d)
    
    return container.html()

}

write('test.svg', createSvg())