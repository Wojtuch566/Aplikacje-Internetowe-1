<?php

namespace App\Model;

use App\Service\Config;

class Game
{
    private ?int $gameId = null;
    private ?string $gameName = null;
    private ?string $gameReleaseDate = null;
    private ?string $gamePublisher = null;

    public function getGameId(): ?int
    {
        return $this->gameId;
    }

    public function setGameId(?int $gameId): Game
    {
        $this->gameId = $gameId;

        return $this;
    }

    public function getGameName(): ?string
    {
        return $this->gameName;
    }

    public function setGameName(?string $gameName): Game
    {
        $this->gameName = $gameName;

        return $this;
    }

    public function getGameReleaseDate(): ?string
    {
        return $this->gameReleaseDate;
    }

    public function setGameReleaseDate(?string $gameReleaseDate): Game
    {
        $this->gameReleaseDate = $gameReleaseDate;

        return $this;
    }

    public function getGamePublisher(): ?string
    {
        return $this->gamePublisher;
    }

    public function setGamePublisher(?string $gamePublisher): Game
    {
        $this->gamePublisher = $gamePublisher;

        return $this;
    }

    public static function fromArray(array $array): Game
    {
        $game = new self();
        $game->fill($array);

        return $game;
    }

    public function fill(array $array): Game
    {
        if (isset($array['gameId']) && ! $this->getGameId()) {
            $this->setGameId($array['gameId']);
        }
        if (isset($array['gameName'])) {
            $this->setGameName($array['gameName']);
        }
        if (isset($array['gameReleaseDate'])) {
            $this->setGameReleaseDate($array['gameReleaseDate']);
        }
        if (isset($array['gamePublisher'])) {
            $this->setGamePublisher($array['gamePublisher']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "SELECT * FROM game";
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $games = [];
        $gamesArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($gamesArray as $game) {
            $games[] = self::fromArray($game);
        }

        return $games;
    }

    public static function find($id): ?Game
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "SELECT * FROM game WHERE gameId = :gameId";
        $statement = $pdo->prepare($sql);
        $statement->execute(['gameId' => $id]);

        $gameArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        if (! $gameArray) {
            return null;
        }
        $game = Game::fromArray($gameArray);

        return $game;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getGameId()) {
            $sql = "INSERT INTO game (gameName, gameReleaseDate, gamePublisher) VALUES (:gameName, :gameReleaseDate, :gamePublisher)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'gameName' => $this->getGameName(),
                'gameReleaseDate' => $this->getGameReleaseDate(),
                'gamePublisher' => $this->getGamePublisher()
            ]);

            $this->setGameId($pdo->lastInsertId()) ;
        } else {
            $sql = "UPDATE game SET gameName = :gameName, gameReleaseDate = :gameReleaseDate, gamePublisher = :gamePublisher WHERE gameId = :gameId";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'gameName' => $this->getGameName(),
                'gameReleaseDate' => $this->getGameReleaseDate(),
                'gamePublisher' => $this->getGamePublisher(),
                'gameId' => $this->getGameId()
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM game WHERE gameId = :gameId";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            'gameId' => $this->getGameId()
        ]);

        $this->setGameId(null);
        $this->setGameName(null);
        $this->setGameReleaseDate(null);
        $this->setGamePublisher(null);
    }
}