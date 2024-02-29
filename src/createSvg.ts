import * as d3 from 'd3'
import { JSDOM } from 'jsdom'
import { CommitContributionsByRepository, Repository, Language } from './type'
import write from './write'

const WIDTH = 800
const HEIGHT = 400

let uidCounter = 0 

function uid(prefix : string) {
    return `${prefix}-${uidCounter++}`
}

// Tree Map
export const createTreemap = () => {

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
        .tile(d3.treemapBinary)
        .size([WIDTH, HEIGHT])
        .padding(3)
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
        .attr('style', 'max-width: 100%; height: auto; font: 14px sans-serif;')

    // Add a cell for each leaf of the hierarchy.
    const leaf = svg.selectAll('g')
        .data(root.leaves())
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`)

    // Append a tooltip.
    const format = d3.format(',d')

    // Append a color rectangle. 
    leaf.append('rect')
        .attr('id', (d) => (d as any).leafUid = uid('leaf'))
        .attr('fill', (d: any) : string => {
            while (d.depth > 1) d = d.parent!
            return color(d.data.name) as string
        })
        .attr('fill-opacity', 0.9)
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
        .text((d : any) => d)
    
    return container.html()

}

write('testTreeMap.svg', createTreemap())


// Bar Graph
export const createBarGraph = () => {

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

    // 차트의 크기를 지정합니다.
  const width = 928;
  const height = Math.min(width, 500);

  // 색상 스케일을 생성합니다.
  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.name))
    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

  // 파이 레이아웃과 아크 생성기를 생성합니다.
  const pie = d3.pie<DataItem>()
    .sort(null)
    .value(d => d.value);

  const arc = d3.arc<d3.PieArcDatum<DataItem>>()
    .innerRadius(0)
    .outerRadius(Math.min(width, height) / 2 - 1);

  const labelRadius = arc.outerRadius()() * 0.8;

  // 라벨을 위한 별도의 아크 생성기입니다.
  const arcLabel = d3.arc<d3.PieArcDatum<DataItem>>()
    .innerRadius(labelRadius)
    .outerRadius(labelRadius);

  const arcs = pie(data);

  // SVG 컨테이너를 생성합니다.
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  // 각 값에 대한 섹터 경로를 추가합니다.
  svg.append("g")
    .attr("stroke", "white")
    .selectAll("path")
    .data(arcs)
    .join("path")
      .attr("fill", d => color(d.data.name))
      .attr("d", arc)
    .append("title")
      .text(d => `${d.data.name}: ${d.data.value.toLocaleString("en-US")}`);

  // 가장자리에 라벨을 배치하기 위한 새로운 아크 생성기를 생성합니다.
  // 충분한 공간이 있다면 값이 표시됩니다.
  svg.append("g")
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(arcs)
    .join("text")
      .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
      .call(text => text.append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text(d => d.data.name))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
          .text(d => d.data.value.toLocaleString("en-US")));

  return svg.node()!;

}