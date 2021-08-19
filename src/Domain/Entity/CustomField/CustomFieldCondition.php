<?php


namespace AmeliaBooking\Domain\Entity\CustomField;

use AmeliaBooking\Domain\ValueObjects\Operator;
use AmeliaBooking\Domain\ValueObjects\Number\Integer\Id;
use AmeliaBooking\Domain\ValueObjects\String\Label;

/**
 * Class CustomFieldCondition
 *
 * @package AmeliaBooking\Domain\Entity\CustomField
 */
class CustomFieldCondition
{
    /** @var Id */
    private $id;

    /** @var Id */
    private $customFieldId;

    /** @var Id */
    private $customFieldCondition;

    /** @var Label */
    private $value;

    /** @var  Operator */
    private $operator;

    /**
     * CustomFieldCondition constructor.
     *
     * @param Id  $customFieldId
     * @param Id  $customFieldCondition
     */
    public function __construct(Id $customFieldId, Id $customFieldCondition)
    {
        $this->customFieldId = $customFieldId;
        $this->customFieldCondition = $customFieldCondition;
    }

    /**
     * @return Id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param Id $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return Id
     */
    public function getCustomFieldId()
    {
        return $this->customFieldId;
    }

    /**
     * @param Id $customFieldId
     */
    public function setCustomFieldId($customFieldId)
    {
        $this->customFieldId = $customFieldId;
    }

    /**
     * @return Id
     */
    public function getCustomFieldCondition()
    {
        return $this->customFieldCondition;
    }

    /**
     * @param Id $customFieldCondition
     */
    public function setCustomFieldCondition($customFieldCondition)
    {
        $this->customFieldCondition = $customFieldCondition;
    }

    /**
     * @return Label
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @param Label $value
     */
    public function setValue(Label $value)
    {
        $this->value = $value;
    }

     /**
     * @return Operator
     */
    public function getOperator()
    {
        return $this->operator;
    }

    /**
     * @param Operator $operator
     */
    public function setOperator(Operator $operator)
    {
        $this->operator = $operator;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'id'                    => null !== $this->getId() ? $this->getId()->getValue() : null,
            'customFieldId'         => $this->getCustomFieldId()->getValue(),
            'customFieldCondition'  => $this->getCustomFieldCondition()->getValue(),
            'value'                 => $this->getValue()->getValue(),
            'operator'              => $this->getOperator()->getValue(),
        ];
    }
}
