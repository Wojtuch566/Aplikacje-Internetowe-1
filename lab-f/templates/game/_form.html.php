<?php
    /** @var $game ?\App\Model\Game */
?>

<div class="form-group">
    <label for="gameName">Name</label>
    <input type="text" id="gameName" name="game[gameName]" value="<?= $game ? $game->getGameName() : '' ?>">
</div>

<div class="form-group">
    <label for="gameReleaseDate">Release Date</label>
    <input type="date" id="gameReleaseDate" name="game[gameReleaseDate]" value="<?= $game ? $game->getGameReleaseDate() : '' ?>">
</div>

<div class="form-group">
    <label for="gamePublisher">Publisher</label>
    <input type="text" id="gamePublisher" name="game[gamePublisher]" value="<?= $game ? $game->getGamePublisher() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
