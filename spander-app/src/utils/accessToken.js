export const getToken = () => {
    const localItems = localStorage.getItem("user")
    const { accesToken } = JSON.parse(localItems)??{};

    return accesToken
}



