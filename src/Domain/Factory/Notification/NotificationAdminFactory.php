<?php

namespace AmeliaBooking\Domain\Factory\Notification;

use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;
use AmeliaBooking\Domain\Entity\Notification\NotificationAdmin;
use AmeliaBooking\Domain\ValueObjects\BooleanValueObject;
use AmeliaBooking\Domain\ValueObjects\Number\Integer\Id;

/**
 * Class NotificationAdminFactory
 *
 * @package AmeliaBooking\Domain\Factory\Notification
 */
class NotificationAdminFactory
{
    /**
     * @param array $data
     *
     * @return NotificationAdmin
     * @throws InvalidArgumentException
     */
    public static function create($data)
    {
        $notification = new NotificationAdmin();

        if (isset($data['id'])) {
            $notification->setId(new Id($data['id']));
        }

        if (isset($data['locationId'])) {
            $notification->setLocationId(new Id($data['locationId']));
        }

        if (isset($data['wpUserId'])) {
            $notification->setWpUserId(new Id($data['wpUserId']));
        }

        if (isset($data['isAdmin'])) {
            $notification->setIsAdmin(new BooleanValueObject($data['isAdmin']));
        }

        return $notification;
    }
}
