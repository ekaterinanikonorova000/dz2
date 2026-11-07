const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`

let data
try{
    data = JSON.parse(sourceJson)
} catch (error) {
    console.log("Найдена ошибка",error.message)
}
function buildReport(services, guideChecked, audioChecked, catalogChecked) {
    const dataChecked = {services:services, guide:guideChecked, audio:audioChecked, catalog:catalogChecked}


    const filterdata = services.filter((service) => dataChecked[service.id])
    const items = filterdata.map((item) => {
      const {title,price} = item
      return {title : title.trim(), price : price}
  })

    const total = items.reduce((result, item) => result + item.price, 0)


    return {
      count : items.length,
      total,
      items
    }
}
const btn = document.querySelector('#show-program')
const prog = document.querySelector('#program')
const form = document.querySelector('#service-form')
const checkGuide = document.querySelector('#guide')
const checkAudio = document.querySelector('#audio')
const checkCatalog = document.querySelector('#catalog')
const errChoice = document.querySelector('#choice-error')
const errData = document.querySelector('#data-error')
const res = document.querySelector('#result')
const jsonBlock = document.querySelector('#report-json')

if (data === null) {
    errData.hidden = false
    form.hidden = true
    console.log("Ошибка данных")
} else {
    btn.addEventListener('click', function() {
        prog.hidden = false
        prog.innerHTML = data.event.meeting
        console.log("Программа показана")
    })

    form.addEventListener('submit', function(event) {
        event.preventDefault()

        const g = checkGuide.checked
        const a = checkAudio.checked
        const c = checkCatalog.checked

        if (!g && !a && !c) {
            errChoice.hidden = false
            res.hidden = true
            jsonBlock.hidden = true
            console.log("Ничего не выбрано")
            return
        }

        errChoice.hidden = true

        const report = buildReport(data.services, g, a, c)

        const titles = report.items.map(item => item.title).join('<br>')

        res.innerHTML = 'Выбрано услуг: ' + report.count + '<br>Итого: ' + report.total + ' руб.<br>' + titles
        jsonBlock.textContent = JSON.stringify(report)

        JSON.parse(jsonBlock.textContent)

        res.hidden = false
        jsonBlock.hidden = false
        console.log(`Готово ${report}`)
    })
}