create table game
(
    gameId      integer not null
        constraint post_pk
            primary key autoincrement,
    gameName text not null,
    gameReleaseDate text not null,
    gamePublisher text not null
);
