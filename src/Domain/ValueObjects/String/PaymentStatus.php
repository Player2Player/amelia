<?php

namespace AmeliaBooking\Domain\ValueObjects\String;

/**
 * Class PaymentStatus
 *
 * @package AmeliaBooking\Domain\ValueObjects\String
 */
final class PaymentStatus
{
    const PAID = 'paid';

    const PENDING = 'pending';

    const CANCELED = 'canceled';

    const REFUNDED = 'refunded';

    const PARTIALLY_PAID = 'partiallyPaid';

    /**
     * @var string
     */
    private $status;

    /**
     * Status constructor.
     *
     * @param string $status
     */
    public function __construct($status)
    {
        $this->status = $status;
    }

    /**
     * Return the status from the value object
     *
     * @return string
     */
    public function getValue()
    {
        return $this->status;
    }
}
