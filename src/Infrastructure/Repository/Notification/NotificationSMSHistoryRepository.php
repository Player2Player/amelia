<?php

namespace AmeliaBooking\Infrastructure\Repository\Notification;

use AmeliaBooking\Domain\Services\DateTime\DateTimeService;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Infrastructure\Common\Exceptions\NotFoundException;
use AmeliaBooking\Infrastructure\Repository\AbstractRepository;
use AmeliaBooking\Infrastructure\WP\InstallActions\DB\Booking\AppointmentsTable;
use AmeliaBooking\Infrastructure\WP\InstallActions\DB\User\UsersTable;

/**
 * Class NotificationSMSHistoryRepository
 *
 * @package AmeliaBooking\Infrastructure\Repository\Notification
 */
class NotificationSMSHistoryRepository extends AbstractRepository
{
    /**
     * @param $data
     *
     * @return bool
     *
     * @throws QueryExecutionException
     * @throws \Exception
     */
    public function add($data)
    {
        $params = [
            ':notificationId' => $data['notificationId'],
            ':userId'         => $data['userId'],
            ':appointmentId'  => $data['appointmentId'] ?: null,
            ':eventId'        => $data['eventId'] ?: null,
            ':text'           => $data['text'],
            ':phone'          => $data['phone'],
            ':alphaSenderId'  => $data['alphaSenderId']
        ];

        try {
            $statement = $this->connection->prepare(
                "INSERT INTO {$this->table} 
                (
                    `notificationId`,
                    `userId`,
                    `appointmentId`,
                    `eventId`,
                    `text`,
                    `phone`,
                    `alphaSenderId`
                )
                VALUES 
                (
                    :notificationId,
                    :userId,
                    :appointmentId,
                    :eventId,
                    :text,
                    :phone,
                    :alphaSenderId
                )"
            );

            $res = $statement->execute($params);
            if (!$res) {
                throw new QueryExecutionException('Unable to add data in ' . __CLASS__);
            }

            return $this->connection->lastInsertId();
        } catch (\Exception $e) {
            throw new QueryExecutionException('Unable to add data in ' . __CLASS__, $e->getCode(), $e);
        }
    }

    /**
     * @param $id
     * @param $data
     *
     * @return bool
     * @throws QueryExecutionException
     */
    public function update($id, $data)
    {
        $params = [
            ':logId'    => $data['logId'],
            ':dateTime' => $data['dateTime'],
            ':status'   => $data['status'],
            ':price'    => $data['price'],
            ':segments' => $data['segments'],
            ':messageSid' => $data['messageSid'],
            ':accountSid' => $data['accountSid'],
            ':id'       => $id
        ];

        try {
            $statement = $this->connection->prepare(
                "UPDATE {$this->table} SET
                `logId` = COALESCE(:logId, `logId`),
                `dateTime` = COALESCE(:dateTime, `dateTime`),
                `status` = COALESCE(:status, `status`),
                `price` = COALESCE(:price, `price`),
                `segments` = COALESCE(:segments, `segments`),
                `messageSid` = COALESCE(:messageSid, `messageSid`),
                `accountSid` = COALESCE(:accountSid, `accountSid`)
                WHERE id = :id"
            );

            $res = $statement->execute($params);

            if (!$res) {
                throw new QueryExecutionException('Unable to save data in ' . __CLASS__);
            }

            return $res;
        } catch (\Exception $e) {
            throw new QueryExecutionException('Unable to save data in ' . __CLASS__, $e->getCode(), $e);
        }
    }

    /**
     * @param $criteria
     * @param $itemsPerPage
     *
     * @return array
     * @throws QueryExecutionException
     */
    public function getFiltered($criteria, $itemsPerPage)
    {
        try {
            $params = [];
            $where = [];

            if (!empty($criteria['dates'])) {
                $where[] = "(DATE_FORMAT(h.dateTime, '%Y-%m-%d %H:%i:%s') BETWEEN :dateFrom AND :dateTo)";
                $params[':dateFrom'] = DateTimeService::getCustomDateTimeInUtc($criteria['dates'][0]);
                $params[':dateTo'] = DateTimeService::getCustomDateTimeObjectInUtc(
                    $criteria['dates'][1]
                )->modify('+1 day')->format('Y-m-d H:i:s');
            }

            $where = $where ? ' AND ' . implode(' AND ', $where) : '';

            $limit = $this->getLimit(
                !empty($criteria['page']) ? (int)$criteria['page'] : 0,
                (int)$itemsPerPage
            );

            $usersTable = UsersTable::getTableName();

            $statement = $this->connection->prepare(
                "SELECT h.*, CONCAT(u.firstName, ' ', u.lastName) as userFullName
                FROM {$this->table} h
                LEFT JOIN {$usersTable} u ON h.userId = u.id
                WHERE 1=1 $where
                ORDER BY h.id DESC
                {$limit}"
            );

            $statement->execute($params);

            $rows = $statement->fetchAll();

            foreach ($rows as &$row) {
                $row['dateTime'] = DateTimeService::getCustomDateTimeFromUtc($row['dateTime']);
            }
        } catch (\Exception $e) {
            throw new QueryExecutionException('Unable to get data from ' . __CLASS__, $e->getCode(), $e);
        }

        return $rows;
    }

    /**
     * @param $criteria
     *
     * @return mixed
     * @throws QueryExecutionException
     */
    public function getCount($criteria)
    {
        try {
            $params = [];
            $where = [];

            if (!empty($criteria['dates'])) {
                $where[] = "(DATE_FORMAT(h.dateTime, '%Y-%m-%d %H:%i:%s') BETWEEN :dateFrom AND :dateTo)";
                $params[':dateFrom'] = DateTimeService::getCustomDateTimeInUtc($criteria['dates'][0]);
                $params[':dateTo'] = DateTimeService::getCustomDateTimeObjectInUtc(
                    $criteria['dates'][1]
                )->modify('+1 day')->format('Y-m-d H:i:s');
            }

            $where = $where ? ' AND ' . implode(' AND ', $where) : '';

            $statement = $this->connection->prepare(
                "SELECT COUNT(*) AS count
                    FROM {$this->table} h
                    WHERE 1=1 {$where}"
            );

            $statement->execute($params);

            $row = $statement->fetch()['count'];

        } catch (\Exception $e) {
            throw new QueryExecutionException('Unable to get data from ' . __CLASS__, $e->getCode(), $e);
        }

        return $row;
    }

    /**
     * @param $criteria
     *     
     * @return array
     * @throws QueryExecutionException
     */
    public function getLastNotificationDelivered($criteria)
    {
      $row = null;        
      $params = [':status' => 'delivered'];
      $where = [];
      try {
        if (!empty($criteria['notificationId'])) {
          $where[] = "a.`notificationId` = :notificationId";
          $params[':notificationId'] = $criteria['notificationId'];
        }

        if (!empty($criteria['phone'])) {
          $where[] = "a.`phone` = :phone";
          $params[':phone'] = $criteria['phone'];
        }

        $where = $where ? ' AND ' . implode(' AND ', $where) : '';
        $appointmentTable = AppointmentsTable::getTableName();
        $statement = $this->connection->prepare(
            "SELECT a.*, b.status as appointmentStatus
            FROM {$this->table} a
            INNER JOIN $appointmentTable b
            ON b.id = a.appointmentId
            WHERE a.`status` = :status $where
            ORDER BY a.`dateTime` DESC
            LIMIT 1"
        );

        $statement->execute($params);

        $row = $statement->fetch();
      } catch (\Exception $e) {
          throw new QueryExecutionException('Unable to get data from ' . __CLASS__, $e->getCode(), $e);
      }

      if (!$row) {
        throw new NotFoundException('Data not found in ' . __CLASS__);
      }
      return $row;
    }

}
