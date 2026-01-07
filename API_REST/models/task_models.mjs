export class User{
    constructor({user_name, password}){
        this.user_name = user_name
        this.password = password
    }
}
export class Favourites{
    constructor({user_name, name_game, price}){
        this.user_name = user_name
        this.name_game = name_game
        this.price = price
    }
}
/*export class Sales{
    constructor({user_name, name_game, price, offer}){
        this.user_name = user_name
        this.name_game = name_game
        this.price = price
        this.offer = offer
    }
}*/
export class Games{
    constructor({name_game, price, image}){
        this.name_game = name_game
        this.price = price
        this.image = image
    }
}