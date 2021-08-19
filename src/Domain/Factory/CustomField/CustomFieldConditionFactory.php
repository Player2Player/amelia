<?php

namespace AmeliaBooking\Domain\Factory\CustomField;

use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;
use AmeliaBooking\Domain\Entity\CustomField\CustomFieldCondition;
use AmeliaBooking\Domain\ValueObjects\Operator;
use AmeliaBooking\Domain\ValueObjects\Number\Integer\Id;
use AmeliaBooking\Domain\ValueObjects\String\Label;

/**
 * Class CustomFieldConditionFactory
 *
 * @package AmeliaBooking\Domain\Factory\CustomField
 */
class CustomFieldConditionFactory
{
    /**
     * @param $data
     *
     * @return CustomFieldCondition
     * @throws InvalidArgumentException
     */
    public static function create($data)
    {
        $customFieldCondition = new CustomFieldCondition(
            new Id($data['customFieldId']),
            new Id($data['customFieldCondition'])
        );

        if (isset($data['operator'])) {
            $customFieldCondition->setOperator(new Operator($data['operator']));
        }

        if (isset($data['value'])) {
            $customFieldCondition->setValue(new Label($data['value']));
        }

        if (isset($data['id'])) {
            $customFieldCondition->setId(new Id($data['id']));
        }

        return $customFieldCondition;
    }
}
