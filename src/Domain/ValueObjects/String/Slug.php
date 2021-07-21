<?php

namespace AmeliaBooking\Domain\ValueObjects\String;

use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;

/**
 * Class Slug
 *
 * @package AmeliaBooking\Domain\ValueObjects\String
 */
final class Slug
{
    const MAX_LENGTH = 255;
    /**
     * @var string
     */
    private $slug;

    /**
     * Slug constructor.
     *
     * @param string $slug
     *
     * @throws InvalidArgumentException
     */
    public function __construct($slug)
    {
        if (empty($slug)) {
            $slug = '';
            //throw new InvalidArgumentException("Name can't be empty");
        }

        if (strlen($slug) > static::MAX_LENGTH) {
            throw new InvalidArgumentException("Name '$slug' must be less than " . static::MAX_LENGTH . ' chars');
        }

        $this->slug = $slug;
    }

    /**
     * Return the name from the value object
     *
     * @return string
     */
    public function getValue()
    {
        return $this->slug;
    }
}
