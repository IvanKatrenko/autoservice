//пишем функцию получения данных
export const fetchData = async () => {
    try {
        const response = await fetch('https://delicate-inky-anaconda.glitch.me/api')//запрос к серверу с помощтю fetch

        if (!response.ok) { //а response вернулся хороший
            throw new Error(`HTTP error ! Status: ${response.status}`);
        }
        return await response.json(); //данные храняться в формате json!!, если все окей то мы должны вернуть результат

    } catch (error) {
        console.log(`Error: ${error}`)
    }
}
//try.... catch действует так что если произойдет ошибка в try то выведет ошибку в catch