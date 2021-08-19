<?php

namespace AmeliaBooking\Domain\ValueObjects;

use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;

/**
 * Class Operator
 *
 * @package AmeliaBooking\Domain\ValueObjects
 */
final class Operator
{
    const OPERATOR_EQUAL = 'equal';
    const OPERATOR_NOT_EQUAL = 'not-equal';
    const OPERATOR_EMPTY = 'empty';
    const OPERATOR_NOT_EMPTY = 'not-empty';

    /**
     * @var string
     */
    private $value;

    /**
     * @param string $value
     *
     * @throws InvalidArgumentException
     */
    public function __construct($value)
    {
      $validValues = [self::OPERATOR_EQUAL, self::OPERATOR_NOT_EQUAL, self::OPERATOR_EMPTY, self::OPERATOR_NOT_EMPTY, null];
      if (!in_array($value, $validValues, true)) {
            throw new InvalidArgumentException('Not valid operator option');
        }
        $this->value = $value;
    }

    /**
     * Return the value from the value object
     *
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }
}
