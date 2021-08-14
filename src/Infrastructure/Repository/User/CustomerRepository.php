<?php

namespace AmeliaBooking\Infrastructure\Repository\User;

use AmeliaBooking\Domain\Collection\Collection;
use AmeliaBooking\Domain\Entity\User\AbstractUser;
use AmeliaBooking\Domain\Repository\User\CustomerRepositoryInterface;
use AmeliaBooking\Domain\Services\DateTime\DateTimeService;
use AmeliaBooking\Domain\ValueObjects\String\BookingStatus;
use AmeliaBooking\Domain\ValueObjects\String\Status;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Infrastructure\WP\InstallActions\DB\Booking\AppointmentsTable;
use AmeliaBooking\Infrastructure\WP\InstallActions\DB\Booking\CustomerBookingsTable;
use AmeliaBooking\Infrastructure\WP\InstallActions\DB\User\WPUsersTable;
use AmeliaBooking\Infrastructure\WP\InstallActions\DB;
use AmeliaBooking\Domain\Factory\User\CustomerChildFactory;

/**
 * Class UserRepository
 *
 * @package AmeliaBooking\Infrastructure\Repository
 */
class CustomerRepository extends UserRepository implements CustomerRepositoryInterface
{
    
    public function getCustomerChildren($customerId) {
      $customerChildTable = DB\User\Customer\CustomerChildTable::getTableName();
      $childrenServiceTable = DB\User\Customer\ChildServiceTable::getTableName();
      $serviceTable = DB\Bookable\ServicesTable::getTableName();
      try {
        $statement = $this->connection->prepare(
          "SELECT
              u.id AS child_id,
              u.firstName AS child_firstName,
              u.lastName AS child_lastName,
              u.birthday AS child_birthday,
              st.serviceId AS service_id,
              s.name AS service_name,
              s.description AS service_description,
              s.price as service_price,
              s.status as service_status,
              s.categoryId AS service_categoryId
          FROM $customerChildTable u
          LEFT JOIN $childrenServiceTable st ON st.customerChildrenId = u.id
          LEFT JOIN $serviceTable s ON s.id = st.serviceId
          WHERE u.customerId = :customer
          ORDER BY CONCAT(u.firstName, ' ', u.lastName)"
        );

        $statement->bindParam(':customer', $customerId);
        $statement->execute();        

        $customerRows = [];

        while ($row = $statement->fetch()) {
            $this->parseCustomerChildRow($row, $customerRows);
        }

        $providers = CustomerChildFactory::createChildrenCollection($customerRows);

        if (!$providers->length()) {
            return new Collection();
        }
      }
      catch (\Exception $e) {
        throw new QueryExecutionException('Unable to find by id in ' . __CLASS__, $e->getCode(), $e);
      }

      return $providers;
    }
  

    /**
     * @param     $criteria
     * @param int $itemsPerPage
     *
     * @return array
     * @throws QueryExecutionException
     * @throws \Exception
     */
    public function getFiltered($criteria, $itemsPerPage = null)
    {
        try {
            $wpUserTable = WPUsersTable::getTableName();
            $bookingsTable = CustomerBookingsTable::getTableName();
            $appointmentsTable = AppointmentsTable::getTableName();

            $params = [
                ':type_customer'        => AbstractUser::USER_ROLE_CUSTOMER,
                ':type_admin'           => AbstractUser::USER_ROLE_ADMIN,
            ];

            $joinWithBookings = empty($criteria['ignoredBookings']);

            $where = [
                'u.type IN (:type_customer, :type_admin)',
            ];

            $order = '';
            if (!empty($criteria['sort'])) {
                $column = $criteria['sort'][0] === '-' ? substr($criteria['sort'], 1) : $criteria['sort'];
                $orderColumn = $column === 'customer' ? 'CONCAT(u.firstName, " ", u.lastName)' : 'lastAppointment';
                $orderDirection = $criteria['sort'][0] === '-' ? 'DESC' : 'ASC';
                $order = "ORDER BY {$orderColumn} {$orderDirection}";

                $joinWithBookings = $column !== 'customer' ?  true : $joinWithBookings;
            }

            if (!empty($criteria['search'])) {
                $params[':search1'] = $params[':search2'] = $params[':search3'] = $params[':search4'] =
                    "%{$criteria['search']}%";

                $where[] = "((CONCAT(u.firstName, ' ', u.lastName) LIKE :search1
                            OR wpu.display_name LIKE :search2
                            OR u.email LIKE :search3
                            OR u.note LIKE :search4))";
            }

            if (!empty($criteria['customers'])) {
                $customersCriteria = [];

                foreach ((array)$criteria['customers'] as $key => $customerId) {
                    $params[":customerId$key"] = $customerId;
                    $customersCriteria[] = ":customerId$key";
                }

                $where[] = 'u.id IN (' . implode(', ', $customersCriteria) . ')';
            }

            $statsFields = '
                NULL as lastAppointment,
                0 as totalAppointments,
                0 as countPendingAppointments,
            ';

            $statsJoins = '';

            if ($joinWithBookings) {
                $params[':bookingPendingStatus'] = BookingStatus::PENDING;

                $statsFields = '
                    MAX(app.bookingStart) as lastAppointment,
                    COUNT(cb.id) as totalAppointments,
                    SUM(case when cb.status = :bookingPendingStatus then 1 else 0 end) as countPendingAppointments,
                ';

                $statsJoins = "
                    LEFT JOIN {$bookingsTable} cb ON u.id = cb.customerId
                    LEFT JOIN {$appointmentsTable} app ON app.id = cb.appointmentId
                ";
            }

            $where = $where ? 'WHERE ' . implode(' AND ', $where) : '';

            $limit = $this->getLimit(
                !empty($criteria['page']) ? (int)$criteria['page'] : 0,
                (int)$itemsPerPage
            );

            $statement = $this->connection->prepare(
                "SELECT 
                u.id as id,
                u.status as status,
                u.firstName as firstName,
                u.lastName as lastName,
                u.email as email,
                u.phone as phone,
                u.countryPhoneIso AS countryPhoneIso,
                u.gender as gender,
                u.externalId as externalId,
                IF(u.birthday IS NOT NULL, u.birthday , '') as birthday,
                u.note as note,
                {$statsFields}
                IF(wpu.display_name IS NOT NULL, wpu.display_name , '') as wpName
                FROM {$this->table} as u
                LEFT JOIN {$wpUserTable} wpu ON u.externalId = wpu.id
                {$statsJoins}
                {$where}
                GROUP BY u.id
                {$order}
                {$limit}"
            );

            $statement->execute($params);

            $rows = $statement->fetchAll();
        } catch (\Exception $e) {
            throw new QueryExecutionException('Unable to get data from ' . __CLASS__, $e->getCode(), $e);
        }

        $items = [];
        foreach ($rows as $row) {
            $row['id'] = (int)$row['id'];
            $row['externalId'] = $row['externalId'] === null ? $row['externalId'] : (int)$row['externalId'];
            $row['lastAppointment'] = $row['lastAppointment'] ?
                DateTimeService::getCustomDateTimeFromUtc($row['lastAppointment']) : $row['lastAppointment'];
            $items[(int)$row['id']] = $row;
        }

        return $items;
    }

    /**
     * @param $criteria
     *
     * @return mixed
     * @throws QueryExecutionException
     */
    public function getCount($criteria)
    {
        $wpUserTable = WPUsersTable::getTableName();

        $params = [
            ':type_customer' => AbstractUser::USER_ROLE_CUSTOMER,
            ':type_admin'    => AbstractUser::USER_ROLE_ADMIN,
            ':statusVisible' => Status::VISIBLE,
        ];

        $where = [
            'u.type IN (:type_customer, :type_admin)',
            'u.status = :statusVisible'
        ];

        if (!empty($criteria['search'])) {
            $params[':search1'] = $params[':search2'] = $params[':search3'] = $params[':search4'] =
                "%{$criteria['search']}%";

            $where[] = "((CONCAT(u.firstName, ' ', u.lastName) LIKE :search1
                            OR wpu.display_name LIKE :search2
                            OR u.email LIKE :search3
                            OR u.note LIKE :search4))";
        }

        if (!empty($criteria['customers'])) {
            $customersCriteria = [];

            foreach ((array)$criteria['customers'] as $key => $customerId) {
                $params[":customerId$key"] = $customerId;
                $customersCriteria[] = ":customerId$key";
            }

            $where[] = 'u.id IN (' . implode(', ', $customersCriteria) . ')';
        }

        $where = $where ? 'WHERE ' . implode(' AND ', $where) : '';

        try {
            $statement = $this->connection->prepare(
                "SELECT COUNT(*) as count
                FROM {$this->table} as u 
                LEFT JOIN {$wpUserTable} wpu ON u.externalId = wpu.id
                $where"
            );

            $statement->execute($params);

            $rows = $statement->fetch()['count'];
        } catch (\Exception $e) {
            throw new QueryExecutionException('Unable to get data from ' . __CLASS__, $e->getCode(), $e);
        }

        return $rows;
    }

    /** @noinspection MoreThanThreeArgumentsInspection */
    /**
     * @param array $row
     * @param array $customerRows
     *
     * @return void
     */
    private function parseCustomerChildRow($row, &$customerRows)
    {
        $childId = (int)$row['child_id'];
        $serviceId = isset($row['service_id']) ? (int)$row['service_id'] : null;

        if (!array_key_exists($childId, $customerRows)) {
            $customerRows[$childId] = [
                'id'               => $childId,
                'firstName'        => $row['child_firstName'],
                'lastName'         => $row['child_lastName'],
                'birthday'         => isset($row['child_birthday']) ? $row['child_birthday'] : null,
                'serviceList'      => [],
            ];
        }

        if ($serviceId &&
            array_key_exists($childId, $customerRows) &&
            !array_key_exists($serviceId, $customerRows[$childId]['serviceList'])
        ) {
            $customerRows[$childId]['serviceList'][$serviceId] = [
                'id'               => $serviceId,
                'name'             => $row['service_name'],
                'description'      => $row['service_description'],
                'price'            => $row['service_price'],
                'status'           => $row['service_status'],
                'categoryId'       => (int)$row['service_categoryId'],
            ];
        }

    }

}
